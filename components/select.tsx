"use client";

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value?: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};
export default function Select({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: Props) {
  return (
    <>
      <div>select</div>
    </>
  );
}
