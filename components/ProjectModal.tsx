
import React from 'react';
import { Project } from '../types';
import { X, Calendar, User, Clapperboard } from 'lucide-react';

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

  // Helper to determine if the video URL is an embed (YouTube/Vimeo) or a direct file
  const isEmbed = (url: string) => {
    const lower = url.toLowerCase();
    return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com');
  };

  // Helper to convert standard URLs to Embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    
    // YouTube Regex
    // Robustly captures the 11-character Video ID from:
    // - youtube.com/watch?v=ID
    // - youtube.com/embed/ID
    // - youtube.com/shorts/ID
    // - youtube.com/v/ID
    // - youtu.be/ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = cleanUrl.match(youtubeRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      // Return clean embed URL with rel=0 to prevent related videos from other channels
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`;
    }

    // Vimeo Regex
    // Captures ID from vimeo.com/ID or player.vimeo.com/video/ID
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = cleanUrl.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Fallback: Return original if parsing failed but it looks like a link
    return cleanUrl;
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
          {/* Subtle gradient to ensure text readability without hiding image color */}
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

              {/* Video Section - Now loops through multiple videos */}
              {project.videoUrls && project.videoUrls.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-white border-b border-neutral-800 pb-2 mb-4 flex items-center">
                     <Clapperboard className="mr-2" size={20}/> Video Documentation
                  </h3>
                  <div className="space-y-6">
                    {project.videoUrls.map((url, index) => {
                      const embedUrl = getEmbedUrl(url);
                      const showIframe = isEmbed(url);

                      return (
                        <div key={index} className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden border border-neutral-800 shadow-lg">
                          {showIframe ? (
                            <iframe 
                              src={embedUrl} 
                              className="absolute top-0 left-0 w-full h-full"
                              title={`${project.title} video ${index + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                              allowFullScreen
                            />
                          ) : (
                            <video 
                              src={url}
                              controls
                              className="absolute top-0 left-0 w-full h-full object-contain"
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
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
