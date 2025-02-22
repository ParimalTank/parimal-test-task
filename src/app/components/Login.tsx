'use client'
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Login = () => {

  const session = useSession();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (session.status !== "authenticated") {
  //     router.push("/");
  //   }
  // }, [session.status, router]);

  // Add dependencies to useEffect

  const formik: any = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values: any) => {
      setLoading(true);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email.toLowerCase(),
          password: values.password,
        });

        if (result?.error) {
          toast.error(result.error);
        }

        router.push("/");
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Or sign in with</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button
              onClick={() => signIn("google")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Google
            </button>
            <button
              onClick={() => signIn("facebook")}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Facebook
            </button>
          </div>
        </div>
        <div className="text-center mt-4">
          Don't have a account?<a href="/register" className="ml-2 text-blue-400">Register now!</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
