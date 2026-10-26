import { STATUS_LABEL } from "@/lib/order-status";

export default function StatusBadge({ status }) {
  return <span className={`status status--${status}`}>{STATUS_LABEL[status] ?? status}</span>;
}
