import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth-slice";
import { fetchCountries } from "../../api/countries";
import { type Country } from "../../types";
import { Phone, KeyRound } from "lucide-react";
import CountrySelect from "./country-select";

const loginSchema = z.object({
  dialCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(8, "Phone number is too short")
    .regex(/^\d+$/, "Invalid phone number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type OtpFormInputs = z.infer<typeof otpSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);
      setLoadingCountries(false);
    };
    getCountries();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { dialCode: "+91", phone: "" },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpFormInputs>({
    resolver: zodResolver(otpSchema),
  });

  const handleSendOtp: SubmitHandler<LoginFormInputs> = () => {
    setSubmitting(true);
    toast.loading("Sending OTP...", { id: "otp-toast" });
    setTimeout(() => {
      toast.success("OTP Sent Successfully!", { id: "otp-toast" });
      setIsOtpSent(true);
      setSubmitting(false);
    }, 2000);
  };

  const handleVerifyOtp: SubmitHandler<OtpFormInputs> = () => {
    setSubmitting(true);
    toast.loading("Verifying OTP...", { id: "verify-toast" });
    setTimeout(() => {
      const successMessage = isLoginView
        ? "Login Successful!"
        : "Sign Up Successful! Redirecting...";
      toast.success(successMessage, { id: "verify-toast" });

      localStorage.setItem("auth-token", "dummy-token-" + Date.now());
      dispatch(login());
      setSubmitting(false);

      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isLoginView ? "Welcome Back!" : "Create an Account"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {isOtpSent
            ? "Enter the 6-digit code sent to your phone."
            : isLoginView
            ? "Sign in with your phone number."
            : "Sign up to get started."}
        </p>
      </div>

      {!isOtpSent ? (
        <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone Number
            </label>
            <div className="mt-1 flex flex-nowrap items-stretch">
              <Controller
                name="dialCode"
                control={control}
                render={({ field }) => (
                  <CountrySelect
                    countries={countries}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loadingCountries}
                  />
                )}
              />
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="9876543210"
                  className="block h-full w-full rounded-r-md border border-l-0 border-gray-300 p-3 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {errors.phone && (
              <p className="mt-2 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
            {errors.dialCode && (
              <p className="mt-2 text-xs text-red-500">
                {errors.dialCode.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || loadingCountries}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitOtp(handleVerifyOtp)} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              One-Time Password
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="otp"
                type="text"
                {...registerOtp("otp")}
                maxLength={6}
                placeholder="------"
                className="block w-full rounded-md border-gray-300 p-3 pl-10 tracking-[1em] text-center focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {otpErrors.otp && (
              <p className="mt-2 text-xs text-red-500">
                {otpErrors.otp.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {submitting ? "Verifying..." : "Verify & Proceed"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setIsLoginView(!isLoginView)}
          className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
        >
          {isLoginView ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
