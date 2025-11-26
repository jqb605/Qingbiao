
import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { polishDescription, isAiEnabled } from '../services/gemini';
import { Plus, Trash2, Save, Image as ImageIcon, Wand2, Loader2, LogOut, Video, X } from 'lucide-react';

interface AdminProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onLogout: () => void;
}

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const Admin: React.FC<AdminProps> = ({ projects, setProjects, onLogout }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (project: Project) => {
    setIsEditing(project.id);
    // Ensure videoUrls exists, fallback to empty array
    setEditForm({ ...project, videoUrls: project.videoUrls || [] });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNew = () => {
    const newId = Date.now().toString();
    const newProject: Project = {
      id: newId,
      title: 'New Project',
      category: 'Drama',
      year: new Date().getFullYear().toString(),
      description: '',
      coverImage: 'https://picsum.photos/800/600',
      galleryImages: [],
      videoUrls: [], // Initialize empty array
      castAndCrew: ''
    };
    setEditForm(newProject);
    setIsEditing(newId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      // [中文说明] 这里的 setProjects 会更新 App.tsx 中的状态，并自动保存到 LocalStorage
      // [Note] setProjects updates App.tsx state and auto-saves to LocalStorage
      if (isEditing === id) {
        setIsEditing(null);
        setEditForm({});
      }
    }
  };

  const handleSave = () => {
    if (!editForm.id || !editForm.title) return;

    // Check if new or existing
    const exists = projects.find(p => p.id === editForm.id);
    // Ensure videoUrls is set even if undefined in form
    const projectToSave = { ...editForm, videoUrls: editForm.videoUrls || [] } as Project;

    let updatedProjects;
    if (exists) {
      updatedProjects = projects.map(p => p.id === editForm.id ? projectToSave : p);
    } else {
      updatedProjects = [projectToSave, ...projects];
    }
    
    try {
      setProjects(updatedProjects);
      setIsEditing(null);
      setEditForm({});
      alert("Project saved successfully!");
    } catch (e) {
      alert("Save failed. The data might be too large for browser storage. Try using external image/video URLs.");
    }
  };

  // [中文说明] 图片上传处理逻辑
  // [Note] Image upload handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // [修改点] 图片大小限制 (建议 < 3MB)
      // [Modifiable] Limit size to avoid LocalStorage quota issues
      if (file.size > 1024 * 1024 * 3) { 
        alert("Image is too large (>3MB). Please compress it or use an external URL.");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setEditForm(prev => ({ ...prev, coverImage: base64 }));
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024 * 2) continue; // Skip large files > 2MB
        const base64 = await fileToBase64(files[i]);
        newImages.push(base64);
      }
      setEditForm(prev => ({ 
        ...prev, 
        galleryImages: [...(prev.galleryImages || []), ...newImages] 
      }));
    }
  };

  // [中文说明] 本地视频上传逻辑 - 追加到数组
  // [Note] Local video upload handler - appends to array
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // [修改点] 视频大小限制 (建议 < 5MB，因为 LocalStorage 总限制通常只有 5-10MB)
      // [Modifiable] Very strict size limit for local video storage
      if (file.size > 1024 * 1024 * 5) {
        alert("Video file is too large for local storage (>5MB). Please upload to YouTube/Vimeo and use the URL instead.");
        return;
      }
      try {
         // 转换为 Data URI (Base64)
         const base64 = await fileToBase64(file);
         setEditForm(prev => ({ 
           ...prev, 
           videoUrls: [...(prev.videoUrls || []), base64]
         }));
      } catch (err) {
        console.error("Video upload failed", err);
      }
    }
  };

  const handleAiPolish = async () => {
    if (!editForm.description) return;
    setIsAiLoading(true);
    try {
      const polished = await polishDescription(editForm.description);
      setEditForm(prev => ({ ...prev, description: polished }));
    } catch (e) {
      alert("AI Generation failed. Check your API Key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper to update a specific video URL by index
  const updateVideoUrl = (index: number, value: string) => {
    const newUrls = [...(editForm.videoUrls || [])];
    newUrls[index] = value;
    setEditForm({ ...editForm, videoUrls: newUrls });
  };

  // Helper to remove a video URL
  const removeVideoUrl = (index: number) => {
    const newUrls = (editForm.videoUrls || []).filter((_, i) => i !== index);
    setEditForm({ ...editForm, videoUrls: newUrls });
  };

  // Helper to add an empty video URL field
  const addVideoUrlField = () => {
    setEditForm({ ...editForm, videoUrls: [...(editForm.videoUrls || []), ''] });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-light tracking-wide text-white">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
            <button 
              onClick={handleAddNew}
              className="flex items-center px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/20"
            >
              <Plus size={18} className="mr-2" /> Add Project
            </button>
          </div>
        </div>

        {/* Editor Section */}
        {isEditing && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-12 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl text-white mb-6 font-medium">
              {projects.find(p => p.id === isEditing) ? 'Edit Project' : 'New Project'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Text Data */}
              <div className="space-y-6">
                <div>
                  {/* [中文说明] 项目标题 */}
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editForm.title || ''}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {/* [中文说明] 分类 (如 Drama, Musical) */}
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Category</label>
                    <input 
                      type="text" 
                      value={editForm.category || ''}
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    {/* [中文说明] 年份 */}
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Year</label>
                    <input 
                      type="text" 
                      value={editForm.year || ''}
                      onChange={e => setEditForm({...editForm, year: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 flex justify-between">
                    <span>Description</span>
                    {/* [中文说明] AI 润色按钮 */}
                    {isAiEnabled() && (
                      <button 
                        onClick={handleAiPolish}
                        disabled={isAiLoading || !editForm.description}
                        className="text-amber-500 flex items-center hover:text-amber-400 text-[10px]"
                      >
                        {isAiLoading ? <Loader2 className="animate-spin mr-1" size={12}/> : <Wand2 className="mr-1" size={12} />}
                        AI Polish
                      </button>
                    )}
                  </label>
                  {/* [中文说明] 项目描述内容 */}
                  <textarea 
                    rows={6}
                    value={editForm.description || ''}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                   {/* [中文说明] 演职员表 */}
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Credits</label>
                  <textarea 
                    rows={4}
                    value={editForm.castAndCrew || ''}
                    onChange={e => setEditForm({...editForm, castAndCrew: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none resize-none"
                    placeholder="Director: ... Cast: ..."
                  />
                </div>

                 <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Video Sources</label>
                  
                  <div className="space-y-2 mb-3">
                    {editForm.videoUrls && editForm.videoUrls.length > 0 ? (
                      editForm.videoUrls.map((url, idx) => (
                        <div key={idx} className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder="Paste YouTube/Vimeo Link"
                              value={url}
                              onChange={(e) => updateVideoUrl(idx, e.target.value)}
                              // Auto trim whitespace on blur
                              onBlur={(e) => updateVideoUrl(idx, e.target.value.trim())}
                              className="flex-1 bg-neutral-950 border border-neutral-800 rounded p-3 text-white focus:border-amber-700 focus:outline-none text-sm"
                            />
                            <button 
                              onClick={() => removeVideoUrl(idx)}
                              className="bg-neutral-800 hover:bg-red-900/50 text-neutral-400 hover:text-red-400 px-3 rounded transition-colors"
                              title="Remove Video"
                            >
                              <X size={16}/>
                            </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-600 italic p-2">No videos added yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={addVideoUrlField}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm transition-colors flex items-center justify-center"
                    >
                      <Plus size={14} className="mr-2"/> Add YouTube/Vimeo Link
                    </button>
                    {/* [中文说明] 本地视频上传按钮 */}
                    <button 
                      onClick={() => videoInputRef.current?.click()}
                      className="bg-neutral-800 px-4 rounded hover:bg-neutral-700 text-white"
                      title="Upload Local Video (Small files only)"
                    >
                      <Video size={18}/>
                    </button>
                     <input 
                      type="file" 
                      ref={videoInputRef} 
                      className="hidden" 
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
                    [中文说明] 支持 YouTube (Watch/Shorts/Embed) 和 Vimeo 链接。
                    <br/>
                    [Note] Supports YouTube (Watch/Shorts) and Vimeo links.
                  </p>
                </div>
              </div>

              {/* Right Column: Media */}
              <div className="space-y-6">
                <div>
                   {/* [中文说明] 封面图片 */}
                   <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Cover Image</label>
                   <div className="relative aspect-video bg-neutral-950 border border-neutral-800 rounded overflow-hidden group">
                      {editForm.coverImage ? (
                        <img src={editForm.coverImage} className="w-full h-full object-cover" alt="Cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-700">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         {/* [中文说明] 点击上传图片 */}
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
                         >
                           Change Cover
                         </button>
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           className="hidden" 
                           accept="image/*"
                           onChange={handleCoverUpload}
                         />
                      </div>
                   </div>
                </div>

                <div>
                  {/* [中文说明] 画廊图片集 */}
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Gallery Images</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {editForm.galleryImages?.map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-neutral-800 rounded overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                        <button 
                          onClick={() => {
                            const newGallery = editForm.galleryImages?.filter((_, i) => i !== idx);
                            setEditForm({...editForm, galleryImages: newGallery});
                          }}
                          className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square bg-neutral-950 border border-dashed border-neutral-700 rounded flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 transition-colors"
                    >
                      <Plus size={24} />
                      <span className="text-xs mt-1">Add</span>
                    </button>
                  </div>
                   <input 
                      type="file" 
                      ref={galleryInputRef} 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                   />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-800">
               <button 
                 onClick={() => {
                   setIsEditing(null);
                   setEditForm({});
                 }}
                 className="px-6 py-2 text-neutral-400 hover:text-white transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSave}
                 className="px-8 py-2 bg-white text-black rounded font-medium hover:bg-neutral-200 transition-colors flex items-center"
               >
                 <Save size={16} className="mr-2" /> Save Project
               </button>
            </div>
          </div>
        )}

        {/* List of Projects */}
        <div className="grid gap-4">
          <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-800">
             <div className="col-span-1">Img</div>
             <div className="col-span-4">Title</div>
             <div className="col-span-3">Category</div>
             <div className="col-span-2">Year</div>
             <div className="col-span-2 text-right">Actions</div>
          </div>
          {projects.map(project => (
            <div key={project.id} className="grid grid-cols-12 items-center py-4 border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors px-2 -mx-2 rounded">
              <div className="col-span-1">
                 <img src={project.coverImage} className="w-10 h-10 object-cover rounded bg-neutral-800" alt="Thumb" />
              </div>
              <div className="col-span-4 font-medium text-neutral-300">{project.title}</div>
              <div className="col-span-3 text-neutral-500">{project.category}</div>
              <div className="col-span-2 text-neutral-500">{project.year}</div>
              <div className="col-span-2 flex justify-end gap-3">
                 <button onClick={() => handleEdit(project)} className="text-neutral-400 hover:text-white">Edit</button>
                 <button onClick={() => handleDelete(project.id)} className="text-red-900 hover:text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Admin;
