import { createFileRoute, Navigate } from "@tanstack/react-router";
export const Route=createFileRoute("/operator/dashboard")({component:()=> <Navigate to="/operator" replace/>});