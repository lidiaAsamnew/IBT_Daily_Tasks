"use client";

import ErrorPanel from "@/components/ErrorPanel";

export default function DashboardError({ reset }) {
  return (
    <ErrorPanel title="The dashboard could not load" reset={reset} backHref="/dashboard" backLabel="Back to the dashboard">
      The numbers could not be read just now. Nothing was lost. Try again, and if it keeps happening come back in a few minutes.
    </ErrorPanel>
  );
}
