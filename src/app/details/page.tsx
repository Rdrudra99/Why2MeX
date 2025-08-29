"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useResult } from "@/context/ResultContext";

export default function Details() {
    const router = useRouter();
    const { setReviewData, loading, setLoading } = useResult();
    const [formData, setFormData] = useState({
        companyName: "",
        companyAddress: "",
        extraInfo: "",
        reviewType: "both"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (value: string) => {
        setFormData(prev => ({ ...prev, reviewType: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setReviewData(data);
                router.push("/result");
            } else {
                console.error("Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Company Review Insights</CardTitle>
                    <CardDescription>
                        Enter company details to get comprehensive reviews from Glassdoor, Indeed, Ambition Box, and Google Maps.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                placeholder="e.g. Google, Microsoft"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="companyAddress">Company Address *</Label>
                            <Input
                                id="companyAddress"
                                name="companyAddress"
                                placeholder="e.g. 1600 Amphitheatre Parkway, Mountain View, CA"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="extraInfo">Extra Information (Optional)</Label>
                            <Textarea
                                id="extraInfo"
                                name="extraInfo"
                                placeholder="Any additional information about the company, industry, size, etc."
                                value={formData.extraInfo}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <Label>What type of reviews are you looking for?</Label>
                            <RadioGroup 
                                value={formData.reviewType} 
                                onValueChange={handleRadioChange}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="both" id="both" />
                                    <Label htmlFor="both" className="font-normal">Both Good and Bad Reviews</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="good" id="good" />
                                    <Label htmlFor="good" className="font-normal">Mostly Positive Reviews</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bad" id="bad" />
                                    <Label htmlFor="bad" className="font-normal">Mostly Negative Reviews</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Reviews...
                                </>
                            ) : (
                                "Get Company Insights"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-muted-foreground">
                    We analyze reviews from multiple sources to provide comprehensive insights.
                </CardFooter>
            </Card>
        </div>
    );
}