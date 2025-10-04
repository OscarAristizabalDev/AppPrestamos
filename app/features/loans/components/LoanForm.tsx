import { useState } from "react";
import { Modal } from "react-native";
import { Quote } from "../interfaces/quote.interface";
import { LoanFormData } from "../schemas/loan.schema";
import CalculateLoanQuoteForm from "./CalculateLoanQuoteForm";
import LoanQuotesList from "./LoanQuotesList";

type CalculateLoanQuoteProps = {
    mode?: 'create' | 'edit';
};

const urlIp = 'http://192.168.100.39:3000/quotes/calculate'
const urlLocal = 'http://localhost:3000/quotes/calculate'

const LoanForm = (mode: CalculateLoanQuoteProps) => {

    const [showQuotes, setShowQuotes] = useState(false);
    const [quotes, setQuotes] = useState<Quote[]>([]);

    const handleCalcultaLoanQuoteSubmit = async (data: LoanFormData): Promise<Quote[]> => {
        try {
            const response = await fetch(urlLocal, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result: Quote[] = await response.json();
            setQuotes(result)
            setShowQuotes(true)
            return result;

        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        }
    };

    return (
        <>
            <CalculateLoanQuoteForm onSubmit={handleCalcultaLoanQuoteSubmit} mode="create" />

            <Modal visible={showQuotes} animationType="slide">
                <LoanQuotesList quotes={quotes} onBack={() => setShowQuotes(false)} />
            </Modal>
        </>
    )

}

export default LoanForm;