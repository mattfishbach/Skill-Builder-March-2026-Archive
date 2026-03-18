import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import IntroScreen from "@/pages/IntroScreen";
import CourseView from "@/pages/CourseView";
import EQCourseView from "@/pages/EQCourseView";
import ExcelCourseView from "@/pages/ExcelCourseView";
import CourseSelection from "@/pages/CourseSelection";

function Router() {
  return (
    <Switch>
      <Route path="/" component={IntroScreen} />
      <Route path="/courses" component={CourseSelection} />
      <Route path="/course/nist-csf" component={CourseView} />
      <Route path="/course/emotional-intelligence" component={EQCourseView} />
      <Route path="/course/excel-formulas" component={ExcelCourseView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
