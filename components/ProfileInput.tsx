
import React from 'react';
import { type Profile } from '../types';

interface ProfileInputProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  onGetRecommendation: (profile: Profile) => void;
  isLoading: boolean;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ profile, setProfile, onGetRecommendation, isLoading }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => ({...prev, [name]: checked}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetRecommendation(profile);
  };

  const isButtonDisabled = !profile.interests.trim() || (!profile.skills.trim() && !profile.isBeginner) || isLoading;

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="flex-grow flex flex-col space-y-4">
        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-brand-gray-light dark:text-brand-gray mb-2">
            Your Interests
          </label>
          <textarea
            id="interests"
            name="interests"
            value={profile.interests}
            onChange={handleInputChange}
            placeholder="e.g., technology, creative design, data analysis..."
            rows={4}
            className="w-full p-3 text-brand-dark-text dark:text-brand-light bg-brand-light-2 dark:bg-brand-dark-3 rounded-lg border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition duration-200"
          />
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-brand-gray-light dark:text-brand-gray mb-2">
            Your Skills
          </label>
          <textarea
            id="skills"
            name="skills"
            value={profile.skills}
            onChange={handleInputChange}
            placeholder="e.g., javascript, project management, public speaking..."
            rows={4}
            className="w-full p-3 text-brand-dark-text dark:text-brand-light bg-brand-light-2 dark:bg-brand-dark-3 rounded-lg border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition duration-200"
          />
        </div>
      </div>
      <div className="mt-auto pt-4">
        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isBeginner"
              checked={profile.isBeginner}
              onChange={handleCheckboxChange}
              className="w-5 h-5 rounded text-brand-yellow bg-brand-light-2 dark:bg-brand-dark-3 border-black/20 dark:border-white/20 focus:ring-brand-yellow focus:ring-offset-brand-light-3 dark:focus:ring-offset-brand-dark focus:ring-2"
            />
            <span className="text-sm font-medium text-brand-gray-light dark:text-brand-gray">
              I'm a beginner
            </span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full text-center px-4 py-3 bg-brand-yellow text-brand-dark text-sm font-bold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'ANALYZING...' : 'GENERATE ROADMAP'}
        </button>
      </div>
    </form>
  );
};

export default ProfileInput;