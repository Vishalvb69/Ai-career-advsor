
import React from 'react';
import { type Recommendation } from '../types';
import { StarIcon, CodeIcon } from './Icons';

interface RecommendationCardProps {
  recommendation: Recommendation | null;
  isLoading: boolean;
}

const RecommendationSkeleton: React.FC = () => (
  <div className="text-center animate-pulse">
    <div className="relative w-20 h-20 mx-auto mb-6">
      <div className="absolute inset-0 bg-brand-yellow rounded-full opacity-30 blur-xl"></div>
      <div className="absolute inset-1 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
    </div>
    <div className="h-8 bg-brand-light-3 dark:bg-brand-dark-3 w-3/4 mx-auto rounded-lg"></div>
    <div className="mt-4 h-4 bg-brand-light-3 dark:bg-brand-dark-3 w-full max-w-md mx-auto rounded-lg"></div>
    <div className="mt-2 h-4 bg-brand-light-3 dark:bg-brand-dark-3 w-1/2 mx-auto rounded-lg"></div>
    <div className="mt-10 h-6 w-1/3 mx-auto bg-brand-light-3 dark:bg-brand-dark-3 rounded-lg"></div>
    <div className="mt-4 flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
      <div className="h-10 w-28 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
      <div className="h-10 w-36 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
      <div className="h-10 w-24 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
      <div className="h-10 w-32 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
      <div className="h-10 w-28 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
    </div>
    <div className="mt-12 flex justify-center">
        <div className="w-full max-w-xs h-24 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
    </div>
  </div>
);

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, isLoading }) => {
  if (isLoading) {
    return <RecommendationSkeleton />;
  }

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-brand-yellow rounded-full opacity-30 blur-xl"></div>
        <div className="absolute inset-1 bg-brand-light-3 dark:bg-brand-dark-3 rounded-full"></div>
        <div className="absolute inset-1 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-tr from-brand-yellow/80 to-yellow-600/50 animate-spin-slow"></div>
        </div>
      </div>
      
      <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark-text dark:text-brand-light text-glow">
        {recommendation ? `Your future as a ${recommendation.career}!` : 'Welcome to Your Future'}
      </h2>
      <p className="mt-2 text-brand-gray-light dark:text-brand-gray max-w-lg mx-auto">
        {recommendation ? recommendation.explanation : 'Analyze your profile to reveal your personalized career path and an inspirational figure to guide you.'}
      </p>

      {recommendation && recommendation.skills && recommendation.skills.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4 text-center text-brand-gray-light dark:text-brand-gray tracking-wider uppercase">Key Skills for Success</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {recommendation.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 bg-brand-light-3 dark:bg-brand-dark-3 py-2 px-4 rounded-full border border-black/10 dark:border-white/10">
                <div className="w-5 h-5 text-brand-yellow">
                  <CodeIcon />
                </div>
                <span className="font-medium text-sm text-brand-dark-text dark:text-brand-light">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendation && (
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4 text-brand-gray-light dark:text-brand-gray tracking-wider uppercase">Inspirational Figure</h3>
          <div className="inline-flex items-center gap-4 bg-brand-light-3 dark:bg-brand-dark-3 p-4 pr-6 rounded-full border border-black/10 dark:border-white/10 shadow-lg">
              <div className="w-12 h-12 text-brand-yellow bg-brand-yellow/10 rounded-full p-2.5">
                  <StarIcon />
              </div>
              <p className="font-bold text-2xl text-brand-dark-text dark:text-brand-light">{recommendation.famousPerson}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
