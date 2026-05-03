import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OrderSummaryProps {
    subtotal: string;
    discount: string;
    delivery: string;
    total: string;
}

const OrderSummary = ({
    subtotal,
    discount,
    delivery,
    total,
}: OrderSummaryProps) => {
    return (
        <Card className="shadow-none">
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between font-heading text-2xl">
                        <div>Total</div>
                        <div>{total}</div>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="">Subtotal</span>
                            <span className="font-medium">
                                {Number(subtotal).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="">Discount</span>
                            <span className="font-medium text-destructive">
                                -{discount}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="">Delivery</span>
                            <span className="font-medium">{delivery}</span>
                        </div>
                    </div>
                </div>

                <Button size="lg" className="w-full">
                    Pay {total}
                </Button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                    By placing an order, you're agreeing to our{' '}
                    <a href="#" className="underline">
                        Privacy Policy
                    </a>
                    ,{' '}
                    <a href="#" className="underline">
                        Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline">
                        Cancellation policy
                    </a>
                    .
                </p>
            </CardContent>
        </Card>
    );
};

export default OrderSummary;
