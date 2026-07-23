function Badge({
  children,
  variant = "default",
}) {
  return (
    <span
      className={`shared-badge shared-badge-${variant}`}
    >
      {children}
    </span>
  );
}

export default Badge;