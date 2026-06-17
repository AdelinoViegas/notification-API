import clsx from "clsx";

type ContainerProps = React.ComponentPropsWithoutRef<"main">;

export default function Container({
  children,
  className,
  ...rest
}: ContainerProps) {
  return (
    <main
      {...rest}
      className={clsx(
        "mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24",
        className
      )}
    >
      {children}
    </main>
  );
}