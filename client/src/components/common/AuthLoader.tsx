"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "@/redux/reducer/userSlice";
import { RootState } from "@/redux/store";
import authService from "@/services/auth.service";

export default function AuthLoader() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);
  const pathname = usePathname();

  // Exclude logic for /, /login, /signup
  const isExcluded = pathname === "/" || pathname === "/login" || pathname === "/signup";
  useEffect(() => {
    if (isExcluded) return;
    if (!user) {
      authService.getCurrentUser()
        .then((userObj) => {
          if (userObj) {
            dispatch(userData(userObj));
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        });
    }
  }, [user, dispatch, isExcluded]);

  return null;
}
