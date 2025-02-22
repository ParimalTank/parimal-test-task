'use client'
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Register = () => {

  const router = useRouter()

  const session = useSession();

  // useEffect(() => {
  //   if (session.status !== "authenticated") {
  //     router.push("/");
  //   }
  // }, [session.status, router]);

  const formik: any = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ''], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values: any) => {

      try {

        const params = {
          name: values.name,
          email: values.email,
          password: values.password
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        if (res.status === 201) {
          signIn("credentials", params);
          router.push("/");
        } else {
          const errorData = await res.json();
          if (errorData.error === "User Already Exists") {
            toast.error("User already exists. Please choose a different email.");
          } else {
            toast.error("An error occurred.");
          }
        }
      } catch (err: any) {
        console.log(err);
      }

    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            ) : null}
          </div>

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
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Or sign up with</p>
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
          Already have a account? <a href="/login" className="ml-2 text-blue-400">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
