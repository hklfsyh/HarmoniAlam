import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import volunteerApi from "../API/volunteer";

const fetchBookmarks = async () => {
  const { data } = await volunteerApi.get("/bookmarks");
  return data;
};

const BookmarkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"event" | "artikel">("event");
  const queryClient = useQueryClient();
  const { data: bookmarks, isLoading, isError, error } = useQuery({
    queryKey: ["myBookmarks"],
    queryFn: fetchBookmarks,
  });

  // Mutasi untuk hapus bookmark event
  const removeBookmark = (eventId: number) =>
    volunteerApi.delete(`/bookmarks/events/${eventId}`);
  const removeBookmarkMutation = useMutation({
    mutationFn: (eventId: number) => removeBookmark(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookmarks"] });
    },
  });

  // Mutasi untuk hapus bookmark artikel
  const removeBookmarkArticle = (articleId: number) =>
    volunteerApi.delete(`/bookmarks/articles/${articleId}`);
  const removeBookmarkArticleMutation = useMutation({
    mutationFn: (articleId: number) => removeBookmarkArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookmarks"] });
    },
  });

  // Pisahkan event dan artikel
  const eventBookmarks = bookmarks
    ? bookmarks.filter((b: any) => b.event && b.event.event_id)
    : [];
  const articleBookmarks = bookmarks
    ? bookmarks.filter((b: any) => b.article && b.article.article_id)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf7e1] to-[#f7f7fa] py-10 px-4 pt-[100px]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A3A53] mb-8 text-center tracking-tight">
          Bookmark Saya
        </h1>
        {/* Tab */}
        <div className="bg-slate-200 p-1 rounded-lg flex mb-6">
          <button
            onClick={() => setActiveTab("event")}
            className={`w-1/2 py-2 rounded-md font-semibold transition-all ${
              activeTab === "event" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Event Tersimpan
          </button>
          <button
            onClick={() => setActiveTab("artikel")}
            className={`w-1/2 py-2 rounded-md font-semibold transition-all ${
              activeTab === "artikel" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            Artikel Tersimpan
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {isLoading ? (
            <div className="text-center text-gray-400 py-6">
              Memuat bookmark...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-6">
              Gagal memuat bookmark: {error.message}
            </div>
          ) : activeTab === "event" ? (
            <div>
              <h2 className="text-xl font-bold text-[#79B829] mb-4">
                Event Tersimpan
              </h2>
              <div className="space-y-4">
                {eventBookmarks.length > 0 ? (
                  eventBookmarks.map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 bg-gradient-to-r from-[#eaf7e1] to-white rounded-lg shadow hover:shadow-xl transition p-4 group border border-[#eaf7e1] relative"
                    >
                      {/* ICON BOOKMARK DI POJOK KIRI ATAS */}
                      <button
                        type="button"
                        className="absolute top-2 left-2 z-10 rounded-full p-2 shadow bg-[#79B829] cursor-pointer transition-colors duration-200 hover:bg-[#5fa31e]"
                        aria-label="Hapus dari Bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmarkMutation.mutate(b.event.event_id);
                        }}
                        disabled={removeBookmarkMutation.isPending}
                        title="Hapus dari Bookmark"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
                        </svg>
                      </button>
                      <div className="relative">
                        <img
                          src={b.event.imagePath}
                          alt={b.event.title}
                          className="w-20 h-20 object-cover rounded-lg border border-[#79B829] group-hover:scale-105 transition"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#1A3A53] text-lg group-hover:text-[#79B829]">
                          {b.event.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(b.event.eventDate).toLocaleDateString()}
                        </div>
                        <Link
                          to={`/event/detail/${b.event.event_id}`}
                          className="inline-block mt-2 text-sm text-[#1A3A53] bg-[#eaf7e1] px-3 py-1 rounded hover:bg-[#79B829] hover:text-white transition"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#eaf7e1] text-[#79B829] text-xs font-semibold">
                        Event
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-6">
                    Belum ada event yang dibookmark.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-[#79B829] mb-4">
                Artikel Tersimpan
              </h2>
              <div className="space-y-4">
                {articleBookmarks.length > 0 ? (
                  articleBookmarks.map((b: any) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 bg-gradient-to-r from-[#f7f7fa] to-white rounded-lg shadow hover:shadow-xl transition p-4 group border border-[#eaf7e1] relative"
                    >
                      {/* ICON BOOKMARK DI POJOK KIRI ATAS */}
                      <button
                        type="button"
                        className="absolute top-2 left-2 z-10 rounded-full p-2 shadow bg-[#79B829] cursor-pointer transition-colors duration-200 hover:bg-[#5fa31e]"
                        aria-label="Hapus dari Bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmarkArticleMutation.mutate(b.article.article_id);
                        }}
                        disabled={removeBookmarkArticleMutation.isPending}
                        title="Hapus dari Bookmark"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 5v16l7-5 7 5V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
                        </svg>
                      </button>
                      <div className="relative">
                        <img
                          src={b.article.imagePath}
                          alt={b.article.title}
                          className="w-20 h-20 object-cover rounded-lg border border-[#79B829] group-hover:scale-105 transition"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#1A3A53] text-lg group-hover:text-[#79B829]">
                          {b.article.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {b.article.summary}
                        </div>
                        <Link
                          to={`/artikel/detail/${b.article.article_id}`}
                          className="inline-block mt-2 text-sm text-[#1A3A53] bg-[#f7f7fa] px-3 py-1 rounded hover:bg-[#79B829] hover:text-white transition"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#f7f7fa] text-[#1A3A53] text-xs font-semibold">
                        Artikel
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-6">
                    Belum ada artikel yang dibookmark.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;