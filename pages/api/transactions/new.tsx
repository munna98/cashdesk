import { useRouter } from 'next/router';
import ReceiptForm from '@/components/transactions/ReceiptForm';
import Head from 'next/head';

export default function NewTransactionPage() {
  const router = useRouter();
  
  const handleReceiptSaved = () => {
    // Optional: Redirect after successful save
    // Uncomment if you want to redirect after saving
    // setTimeout(() => {
    //   router.push('/dashboard');
    // }, 2000);
  };

  return (
    <>
      <Head>
        <title>New Receipt | Your App Name</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">New Receipt</h1>
        <ReceiptForm onReceiptSaved={handleReceiptSaved} />
      </div>
    </>
  );
}