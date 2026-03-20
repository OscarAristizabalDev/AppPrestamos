import LoanForm from "@/src/features/loans/components/LoanForm";

const CreateLoanScreen = () => {
  const handleCreate = (data: any) => {
    console.log("Creating loan:", data);
  };

  return <LoanForm mode="create" />;
};

export default CreateLoanScreen;
