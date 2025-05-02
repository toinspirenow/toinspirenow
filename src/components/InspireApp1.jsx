import Card from './ui/card';
import Button from './ui/button';
import { useState, useEffect } from "react";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function InspireProfileFlow() {
  const defaultPosts = []; // Start with a blank feed

  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem("inspire_posts");
    return stored ? JSON.parse(stored) : defaultPosts;
  });

  useEffect(() => {
    // Save only text data (no image blobs)
    const safePosts = posts.map(({ image, ...rest }) => rest);
    localStorage.setItem("inspire_posts", JSON.stringify(safePosts));
  }, [posts]);

  const [darkMode, setDarkMode] = useState(false);
  const [tab, setTab] = useState("feed");
  const [projectFilter, setProjectFilter] = useState("ongoing");
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [postType, setPostType] = useState("update");
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCreatePost = () => {
    if (!content.trim()) return;
    const newPost = {
      type: postType,
      status: postType === "project" ? "ongoing" : undefined,
      date: new Date().toLocaleString(),
      content: content,
      // Only preview image locally — do not save to storage
    };
    setPosts([newPost, ...posts]);
    setContent('');
    setImage(null);
    setImagePreview(null);
    setPostType("update");
    setShowDialog(false);
  };

  const bgColor = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black';
  const accentColor = darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const cardBg = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black';
  const sidebarBg = darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black';
  const mutedText = darkMode ? 'text-gray-300' : 'text-gray-600';
  const sectionBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';

  const filteredPosts = posts.filter((post) => {
    if (tab === "feed") return true;
    if (tab === "projects") return post.type === "project" && post.status === projectFilter;
    return true;
  });

  return (
    <div className={`min-h-screen ${bgColor} font-sans relative`}>
      {/* Header */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-2xl shadow-md px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={darkMode ? "/inspirebrandv1dm.png" : "/inspirebrandv1.png"}
            alt="Inspire Logo"
            className="h-10 md:h-14 transition duration-300"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome, Juanjo 👋</h1>
        </div>
        <div>
          <Button onClick={() => setDarkMode(!darkMode)} className={`transition ${accentColor}`}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>

      {/* Fullscreen Profile Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={() => setShowFullImage(false)}>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <img src="/JuanjoProfilePicture.png" alt="Full Profile" className="w-full h-[400px] object-cover rounded-md" />
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" onClick={() => setShowFullImage(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className={`w-full ${sectionBg} transition-colors duration-300`}>
        <Card className="w-full max-w-6xl mx-auto mt-6 rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className={`w-full md:w-1/3 p-4 rounded-lg shadow-sm ${sidebarBg} sticky top-6`}>
              <img
                src="/JuanjoProfilePicture.png"
                alt="User Avatar"
                className="w-40 h-40 rounded-full object-cover mb-4 mx-auto border-4 border-white shadow cursor-pointer transition hover:opacity-80"
                onClick={() => setShowFullImage(true)}
              />
              <h2 className="text-2xl font-extrabold text-center">Juanjo Benítez</h2>
              <p className={`text-sm text-center mb-4 ${mutedText}`}>Entrepreneur & Dream Chaser</p>
              <div className="space-y-2">
                <Button className={`w-full transition ${accentColor}`}>Friends (45)</Button>
                <Button className={`w-full transition ${accentColor}`}>Travellers (12)</Button>
                <Button className={`w-full transition ${accentColor}`}>Pinned Goals</Button>
                <Button className={`w-full transition ${accentColor}`}>Customize Profile ✨</Button>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Goals / Journeys</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Gym Journey 🏋️‍♂️ (30%)</li>
                  <li>Startup Launch 🚀 (10%)</li>
                  <li>Enjoy Every Sunset 🌅 (50%)</li>
                  <li>Write a Book 📖 (Completed)</li>
                  <li>Run a Marathon 🏃‍♂️ (Completed)</li>
                </ul>
                <p className={`text-xs mt-2 ${mutedText}`}>Sometimes plans change... and that's okay!</p>
              </div>
            </div>

            {/* Feed */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-xl font-bold text-black dark:text-white">Your Activity</h2>
                <Button variant={tab === "feed" ? "default" : "outline"} onClick={() => setTab("feed")}>Feed</Button>
                <Button variant={tab === "projects" ? "default" : "outline"} onClick={() => setTab("projects")}>Projects</Button>
              </div>

              <Button onClick={() => setShowDialog(true)} className="w-full">Create Post</Button>

              {showDialog && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
                    <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full border rounded-md p-2">
                      <option value="update">Feed Post</option>
                      <option value="project">Project</option>
                    </select>
                    <Textarea
                      placeholder="What inspired you today?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImage(file || null);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setImagePreview(reader.result);
                          reader.readAsDataURL(file);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="rounded-lg w-full max-h-64 object-cover" />
                    )}
                    <Button onClick={handleCreatePost} className="w-full">Post</Button>
                    <Button variant="outline" onClick={() => setShowDialog(false)} className="w-full">Cancel</Button>
                  </div>
                </div>
              )}

              {/* Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <div key={index} className={`${cardBg} p-4 rounded-md shadow-sm`}>
                    <p className="text-sm mb-2 text-right">{post.date}</p>
                    <p>{post.content}</p>

                    {post.progress && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${post.progress}%` }}></div>
                      </div>
                    )}

                    {/* Only preview image for this session — not persisted */}
                    {imagePreview && index === 0 && (
                      <img src={imagePreview} alt="Preview" className="feed-image" />
                    )}

                    <Button
                      onClick={() => {
                        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
                        if (confirmDelete) {
                          const updated = [...posts];
                          updated.splice(index, 1);
                          setPosts(updated);
                        }
                      }}
                      variant="outline"
                      className="w-full mt-4 text-red-500 border-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      Delete Post
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .feed-image {
          display: block;
          margin: 0.5rem auto 0 auto;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 700px;
          max-height: 400px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
