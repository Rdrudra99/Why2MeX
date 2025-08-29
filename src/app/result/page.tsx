"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface ReviewData {
  company_name: string;
  good_reviews: string[];
  bad_reviews: string[];
}

export default function ResultPage() {
    const router = useRouter();
    const [reviewData, setReviewData] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to get the data from sessionStorage
        const storedData = sessionStorage.getItem('companyReviewData');
        if (storedData) {
            try {
                setReviewData(JSON.parse(storedData));
            } catch (error) {
                console.error('Error parsing stored data:', error);
            }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                    <p>Retrieving company review data</p>
                </div>
            </div>
        );
    }

    if (!reviewData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No data available</h2>
                    <p className="mb-6">Please complete the company details form first.</p>
                    <Button onClick={() => router.push("/details")}>Go to Details</Button>
                </div>
            </div>
        );
    }

    const { company_name, good_reviews, bad_reviews } = reviewData;

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
                <Button 
                    variant="outline" 
                    onClick={() => router.push("/details")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                </Button>
                <UserButton />
            </div>
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{company_name}</h1>
                <p className="text-muted-foreground">Real user reviews from Glassdoor, Justdial, AmbitionBox, and Google Maps</p>
            </div>
            
            <Tabs defaultValue="good" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 w-full max-w-md">
                    <TabsTrigger value="good" className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Positive Reviews ({good_reviews?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="bad" className="flex items-center">
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Negative Reviews ({bad_reviews?.length || 0})
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="good">
                    {!good_reviews || good_reviews.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                No positive reviews found for this company.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {good_reviews.map((review, index) => (
                                <Card key={index} className="border-l-4 border-l-green-500">
                                    <CardContent className="pt-6">
                                        <blockquote className="border-l-4 border-l-green-200 pl-4 italic">
                                            "{review}"
                                        </blockquote>
                                    </CardContent>
                                    <CardFooter className="text-sm text-muted-foreground">
                                        Real user review
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
                
                <TabsContent value="bad">
                    {!bad_reviews || bad_reviews.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                No negative reviews found for this company.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {bad_reviews.map((review, index) => (
                                <Card key={index} className="border-l-4 border-l-red-500">
                                    <CardContent className="pt-6">
                                        <blockquote className="border-l-4 border-l-red-200 pl-4 italic">
                                            "{review}"
                                        </blockquote>
                                    </CardContent>
                                    <CardFooter className="text-sm text-muted-foreground">
                                        Real user review
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Raw JSON Response</h3>
                <Card>
                    <CardContent className="pt-6 overflow-auto max-h-96">
                        <pre className="text-xs bg-gray-100 p-4 rounded-md">
                            {JSON.stringify(reviewData, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground">
                    These reviews are collected from actual user feedback posted online.
                </p>
            </div>
        </div>
    );
}