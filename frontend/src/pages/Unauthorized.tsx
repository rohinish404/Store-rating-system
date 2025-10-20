import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent>
        <p className="text-center mb-6">
          You do not have permission to access this page.
        </p>
        <Link to="/">
          <Button className="w-full">Go to Home</Button>
        </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
