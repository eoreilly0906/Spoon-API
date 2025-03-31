import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/recipes');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="main-content">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-dark-text text-center">
                  Welcome to Recipe Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-8">
                  <p className="text-xl text-dark-text-muted">
                    Your personal recipe collection awaits. Log in to start managing your favorite recipes.
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <a
                      href="/login"
                      className="w-full sm:w-64 px-8 py-3 bg-dark-primary text-dark-text rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                      Log In
                    </a>
                    <div className="relative w-full sm:w-64">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-dark-surface text-dark-text-muted">or</span>
                      </div>
                    </div>
                    <a
                      href="/register"
                      className="w-full sm:w-64 px-8 py-3 bg-dark-surface border-2 border-dark-primary text-dark-text rounded-lg hover:bg-dark-primary/10 transition-colors duration-200 font-semibold text-lg"
                    >
                      Create Account
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
