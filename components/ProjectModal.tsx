
import React from 'react';
import { Project } from '../types';
import { X, Calendar, User, Clapperboard, AlertCircle } from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Helper to determine if the video URL is an embed service (YouTube/Vimeo)
  const isEmbedService = (url: string) => {
    const lower = url.toLowerCase();
    return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com');
  };

  // Helper to convert standard URLs to valid Embed URLs
  const getEmbedInfo = (url: string) => {
    if (!url) return { url: '', isValid: false };
    const cleanUrl = url.trim();
    
    // 1. YouTube Handling
    if (cleanUrl.toLowerCase().includes('youtu')) {
        // Robust regex for ID extraction
        // Matches: youtube.com/watch?v=ID, /embed/ID, /shorts/ID, youtu.be/ID
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = cleanUrl.match(youtubeRegex);
        
        if (match && match[1]) {
           return {
             url: `https://www.youtube.com/embed/${match[1]}?rel=0&autoplay=0`,
             isValid: true
           };
        }
        // If it looks like YouTube but regex fails, return invalid to prevent "refused to connect" errors
        return { url: cleanUrl, isValid: false, error: "Invalid YouTube URL format" };
    }

    // 2. Vimeo Handling
    if (cleanUrl.toLowerCase().includes('vimeo')) {
        // Matches: vimeo.com/123, player.vimeo.com/video/123, vimeo.com/channels/.../123
        const vimeoRegex = /(?:vimeo\.com\/(?:.*\/)?|player\.vimeo\.com\/video\/)([0-9]+)/;
        const match = cleanUrl.match(vimeoRegex);
        
        if (match && match[1]) {
           return {
             url: `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`,
             isValid: true
           };
        }
        return { url: cleanUrl, isValid: false, error: "Invalid Vimeo URL format" };
    }

    // 3. Direct File (mp4, etc.)
    return { url: cleanUrl, isValid: true, isFile: true };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl flex flex-col">
        
        {/* Header Image Area */}
        <div className="relative h-64 sm:h-96 w-full shrink-0">
          <img 
            src={project.coverImage} 
            alt={project.title} 
            className="w-full h-full object-cover" 
          />
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-6 left-6 sm:left-10">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-2 shadow-black drop-shadow-lg">
              {project.title}
            </h2>
            <div className="flex items-center space-x-4 text-neutral-300 text-sm sm:text-base">
              <span className="bg-amber-900/60 text-amber-500 px-3 py-1 rounded-full border border-amber-900/50 backdrop-blur-sm">
                {project.category}
              </span>
              <span className="flex items-center drop-shadow-md">
                <Calendar size={16} className="mr-1" /> {project.year}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-10">
          
          {/* Description & Metadata Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-medium text-white border-b border-neutral-800 pb-2">About the Work</h3>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-line text-lg font-light">
                {project.description}
              </p>

              {/* Video Section */}
              {project.videoUrls && project.videoUrls.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-white border-b border-neutral-800 pb-2 mb-4 flex items-center">
                     <Clapperboard className="mr-2" size={20}/> Video Documentation
                  </h3>
                  <div className="space-y-8">
                    {project.videoUrls.map((rawUrl, index) => {
                      // Skip empty strings
                      if (!rawUrl || !rawUrl.trim()) return null;

                      const { url, isValid, isFile, error } = getEmbedInfo(rawUrl);

                      return (
                        <div key={index} className="w-full">
                           <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-neutral-800 shadow-lg">
                            {isFile ? (
                              <video 
                                src={url}
                                controls
                                className="absolute top-0 left-0 w-full h-full object-contain"
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : isValid ? (
                              <iframe 
                                src={url} 
                                className="absolute top-0 left-0 w-full h-full"
                                title={`${project.title} video ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 bg-neutral-900">
                                <AlertCircle size={32} className="mb-2 text-red-800" />
                                <p>Video unavailable</p>
                                <p className="text-xs mt-1 text-neutral-600">{error || "Check URL format"}</p>
                                <a href={rawUrl} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:text-amber-500 mt-2 underline">
                                  Try opening link directly
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {project.castAndCrew && (
                <div>
                  <h3 className="text-xl font-medium text-white border-b border-neutral-800 pb-2 mb-4 flex items-center">
                    <User className="mr-2" size={20}/> Credits
                  </h3>
                  <div className="text-neutral-400 whitespace-pre-line text-sm leading-7">
                    {project.castAndCrew}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Grid */}
          {project.galleryImages.length > 0 && (
            <div>
              <h3 className="text-xl font-medium text-white border-b border-neutral-800 pb-4 mb-6">Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.galleryImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-video overflow-hidden rounded-lg bg-neutral-800">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
