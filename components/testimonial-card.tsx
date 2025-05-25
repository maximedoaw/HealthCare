import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export function Testimonial({ name, role, content, rating }: TestimonialProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star 
      key={i} 
      className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));

  return (
    <div className="rounded-xl shadow-sm border p-6 h-full">
      <div className="flex mb-4">
        {stars}
        <span className="ml-2 text-sm text-gray-500">{rating.toFixed(1)}/5</span>
      </div>
      <blockquote className="text-gray-600 mb-6">
        "{content}"
      </blockquote>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}