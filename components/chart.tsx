type Props = {
  data?:{
    date: string;
    income: number;
    expenses: number;
  }[]
};
export function Chart({ data = [] }: Props) {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}
