"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { SparkleIcon } from "@phosphor-icons/react";
import { startProSubscription } from "@/lib/billing";

type RazorpayCheckout = new (options: Record<string, unknown>) => {
    open: () => void;
};

declare global {
    interface Window {
        Razorpay?: RazorpayCheckout
    }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

type UpgradeButtonProps = {
    className?: string;
    size?: React.ComponentProps<typeof Button>["size"];
    label?: string;
};

export function UpgradeButton({
    className,
    size,
    label = "Upgrade to Pro",
}: UpgradeButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    async function handleUpgrade() {
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
          toast.error("Razorpay is not configured yet.");
          return;
        }
    
        if (!window.Razorpay) {
          toast.error("Checkout is still loading, please try again in a moment.");
          return;
        }
    
        setLoading(true);
    
        try {
          const { subscriptionId } = await startProSubscription();
    
          const checkout = new window.Razorpay({
            key,
            subscription_id: subscriptionId,
            name: "Chai Code Reviewer",
            description: "Pro plan — unlimited AI reviews",
            theme: { color: "#10b981" },
            handler: () => {
              toast.success("Payment successful! Your Pro plan will activate shortly.");
              router.refresh();
            },
          });
    
          checkout.open();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Could not start checkout.";
          toast.error(message);
        } finally {
          setLoading(false);
        }
      }
    return (
        <>
            <Script src={RAZORPAY_SCRIPT_URL} strategy="lazyOnload"></Script>
            <Button
                onClick={handleUpgrade}
                disabled={loading}
                size={size}
                className={cn(className)}
            >
                {loading ? <Spinner className="size-3.5" /> : <SparkleIcon weight="fill" />}
                {loading ? "Opening checkout…" : label}
            </Button>
        </>
    )
}