"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResult } from "@/context/ResultContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, StarHalf, ThumbsDown, ThumbsUp, TrendingUp } from "lucide-react";

export default function ResultPage() {
    const { reviewData } = useResult();
    const router = useRouter();

    useEffect(() => {
        if (!reviewData) {
            router.push("/details");
        }
    }, [reviewData, router]);

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

    const { summary, platformRatings, reviewAnalysis, detailedAssessment, sampleReviews } = reviewData;

    // Generate star rating display
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
        }
        
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
        }
        
        // Add empty stars to make it out of 5
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
        }
        
        return stars;
    };

    // Get color based on rating
    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "bg-green-500";
        if (rating >= 3) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getRatingTextColor = (rating: number) => {
        if (rating >= 4) return "text-green-600";
        if (rating >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <Button 
                variant="outline" 
                onClick={() => router.push("/details")}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Button>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {/* Main Rating Card */}
                <Card className="col-span-full md:col-span-3 lg:col-span-4">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold">Company Review Analysis</CardTitle>
                                <CardDescription>
                                    Based on {summary.totalReviews} reviews from multiple platforms
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end mb-1">
                                    {renderStars(summary.overallRating)}
                                    <span className="ml-2 text-2xl font-bold">{summary.overallRating.toFixed(1)}</span>
                                </div>
                                <Badge 
                                    variant={summary.overallRating >= 3.5 ? "default" : "destructive"}
                                    className="text-xs"
                                >
                                    {summary.overallRating >= 3.5 ? "Recommended" : "Not Recommended"}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">{summary.recommendation}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Glassdoor</p>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {renderStars(platformRatings.glassdoor)}
                                    </div>
                                    <span className="font-bold">{platformRatings.glassdoor.toFixed(1)}</span>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Indeed</p>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {renderStars(platformRatings.indeed)}
                                    </div>
                                    <span className="font-bold">{platformRatings.indeed.toFixed(1)}</span>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Ambition Box</p>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {renderStars(platformRatings.ambitionBox)}
                                    </div>
                                    <span className="font-bold">{platformRatings.ambitionBox.toFixed(1)}</span>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <p className="text-sm text-muted-foreground mb-1">Google Maps</p>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {renderStars(platformRatings.googleMaps)}
                                    </div>
                                    <span className="font-bold">{platformRatings.googleMaps.toFixed(1)}</span>
                                </div>
                            </Card>
                        </div>

                        <Tabs defaultValue="assessment" className="mt-6">
                            <TabsList className="grid grid-cols-3 mb-6">
                                <TabsTrigger value="assessment">Detailed Assessment</TabsTrigger>
                                <TabsTrigger value="themes">Review Themes</TabsTrigger>
                                <TabsTrigger value="reviews">Sample Reviews</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="assessment" className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Work-Life Balance</h3>
                                            <div className="flex items-center">
                                                <span className={`font-bold mr-2 ${getRatingTextColor(detailedAssessment.workLifeBalance.rating)}`}>
                                                    {detailedAssessment.workLifeBalance.rating.toFixed(1)}/5
                                                </span>
                                            </div>
                                        </div>
                                        <Progress 
                                            value={detailedAssessment.workLifeBalance.rating * 20} 
                                            className={getRatingColor(detailedAssessment.workLifeBalance.rating)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {detailedAssessment.workLifeBalance.comments}
                                        </p>
                                    </div>
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Career Growth</h3>
                                            <div className="flex items-center">
                                                <span className={`font-bold mr-2 ${getRatingTextColor(detailedAssessment.careerGrowth.rating)}`}>
                                                    {detailedAssessment.careerGrowth.rating.toFixed(1)}/5
                                                </span>
                                            </div>
                                        </div>
                                        <Progress 
                                            value={detailedAssessment.careerGrowth.rating * 20} 
                                            className={getRatingColor(detailedAssessment.careerGrowth.rating)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {detailedAssessment.careerGrowth.comments}
                                        </p>
                                    </div>
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Management & Leadership</h3>
                                            <div className="flex items-center">
                                                <span className={`font-bold mr-2 ${getRatingTextColor(detailedAssessment.management.rating)}`}>
                                                    {detailedAssessment.management.rating.toFixed(1)}/5
                                                </span>
                                            </div>
                                        </div>
                                        <Progress 
                                            value={detailedAssessment.management.rating * 20} 
                                            className={getRatingColor(detailedAssessment.management.rating)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {detailedAssessment.management.comments}
                                        </p>
                                    </div>
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Company Culture</h3>
                                            <div className="flex items-center">
                                                <span className={`font-bold mr-2 ${getRatingTextColor(detailedAssessment.companyCulture.rating)}`}>
                                                    {detailedAssessment.companyCulture.rating.toFixed(1)}/5
                                                </span>
                                            </div>
                                        </div>
                                        <Progress 
                                            value={detailedAssessment.companyCulture.rating * 20} 
                                            className={getRatingColor(detailedAssessment.companyCulture.rating)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {detailedAssessment.companyCulture.comments}
                                        </p>
                                    </div>
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Salary & Benefits</h3>
                                            <div className="flex items-center">
                                                <span className={`font-bold mr-2 ${getRatingTextColor(detailedAssessment.salaryBenefits.rating)}`}>
                                                    {detailedAssessment.salaryBenefits.rating.toFixed(1)}/5
                                                </span>
                                            </div>
                                        </div>
                                        <Progress 
                                            value={detailedAssessment.salaryBenefits.rating * 20} 
                                            className={getRatingColor(detailedAssessment.salaryBenefits.rating)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {detailedAssessment.salaryBenefits.comments}
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="themes">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-green-600">
                                                <ThumbsUp className="w-5 h-5 mr-2" />
                                                Positive Themes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {reviewAnalysis.positiveThemes.map((theme, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <div className="mr-2 mt-0.5 text-green-500">•</div>
                                                        <span>{theme}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-red-600">
                                                <ThumbsDown className="w-5 h-5 mr-2" />
                                                Negative Themes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {reviewAnalysis.negativeThemes.map((theme, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <div className="mr-2 mt-0.5 text-red-500">•</div>
                                                        <span>{theme}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="reviews">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center text-green-600">
                                            <ThumbsUp className="w-5 h-5 mr-2" />
                                            Positive Reviews
                                        </h3>
                                        
                                        {sampleReviews.positive.map((review, index) => (
                                            <Card key={index} className="p-4 border-l-4 border-l-green-500">
                                                <p className="italic text-sm">"{review}"</p>
                                            </Card>
                                        ))}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center text-red-600">
                                            <ThumbsDown className="w-5 h-5 mr-2" />
                                            Negative Reviews
                                        </h3>
                                        
                                        {sampleReviews.negative.map((review, index) => (
                                            <Card key={index} className="p-4 border-l-4 border-l-red-500">
                                                <p className="italic text-sm">"{review}"</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}