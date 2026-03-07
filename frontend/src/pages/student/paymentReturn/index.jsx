import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/service";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

function PaypalPaymentReturnPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
    console.log(payerId, paymentId, "details paypal")
    useEffect(()=>{
        async function getPaypalPayments(){
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            const result = await captureAndFinalizePaymentService({paymentId, payerId, orderId});

            if(result?.success){
                console.log("payment processed = ", result.data);
                sessionStorage.removeItem('currentOrderId');
                window.location.href = '/my-courses';
            }
        }
        if(paymentId && payerId){
        getPaypalPayments();}
    }, [paymentId, payerId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Processing</CardTitle>
      </CardHeader>
      <CardContent>Please Wait don't go back </CardContent>
    </Card>
  );
}

export default PaypalPaymentReturnPage;
