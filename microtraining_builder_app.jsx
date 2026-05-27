import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Copy, Smartphone, Play, FileQuestion, BarChart3, Share2, Image as ImageIcon, Video, Volume2, CheckCircle2, QrCode, Sparkles } from "lucide-react";

const starterCourse = {
  title: "Quick Training: Talking to Neighbors",
  description: "A lightweight carousel for fast onboarding.",
  audience: "Neighborhood Captains",
  theme: "warm",
  cards: [
    { id: crypto.randomUUID(), type: "text", title: "Start with trust", body: "Introduce yourself as a neighbor first. Keep it short, human, and useful.", mediaUrl: "", audioUrl: "", question: "", options: [], answer: 0 },
    { id: crypto.randomUUID(), type: "checklist", title: "Before you knock", body: "Use this quick readiness check.", mediaUrl: "", audioUrl: "", items: ["Know your zone", "Bring a simple script", "Have one useful resource ready"] },
    { id: crypto.randomUUID(), type: "quiz", title: "Knowledge check", body: "What is the best first sentence?", mediaUrl: "", audioUrl: "", question: "Which opener is strongest?", options: ["Hi, I’m your neighbor John.", "I need you to fill out this form.", "Do you know about our organization?"], answer: 0 }
  ]
};

const blankCard = (type = "text") => ({
  id: crypto.randomUUID(),
  type,
  title: "Untitled card",
  body: "",
  mediaUrl: "",
  audioUrl: "",
  question: "",
  options: type === "quiz" || type === "poll" ? ["Option 1", "Option 2"] : [],
  answer: 0,
  items: type === "checklist" ? ["Checklist item"] : []
});

const cardTypes = [
  { value: "text", label: "Text", icon: FileQuestion },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Volume2 },
  { value: "quiz", label: "Quiz", icon: CheckCircle2 },
  { value: "poll", label: "Poll", icon: BarChart3 },
  { value: "checklist", label: "Checklist", icon: CheckCircle2 }
];

function getShareUrl(course) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(course))));
  return `${window.location.origin}${window.location.pathname}#course=${payload}`;
}

function PhonePreview({ course, activeIndex, setActiveIndex, learnerMode = false }) {
  const card = course.cards[activeIndex] || course.cards[0];
  const [selected, setSelected] = useState(null);
  const progress = course.cards.length ? ((activeIndex + 1) / course.cards.length) * 100 : 0;

  if (!card) return <div className="text-sm text-slate-500">Add a card to preview your training.</div>;

  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2rem] border bg-slate-950 p-3 shadow-2xl">
      <div className="rounded-[1.6rem] bg-white overflow-hidden min-h-[650px] flex flex-col">
        <div className="p-4 border-b bg-slate-50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{course.audience || "Learners"}</p>
              <h2 className="font-semibold leading-tight">{course.title}</h2>
            </div>
            <Smartphone className="h-5 w-5 text-slate-400" />
          </div>
          <Progress value={progress} className="mt-3" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.18 }}
            className="flex-1 p-5 flex flex-col"
          >
            <Badge className="w-fit mb-4" variant="secondary">{card.type}</Badge>
            <h3 className="text-2xl font-bold leading-tight mb-3">{card.title}</h3>
            {card.body && <p className="text-slate-700 text-base leading-relaxed mb-4 whitespace-pre-wrap">{card.body}</p>}

            {card.mediaUrl && (card.type === "image" || card.type === "text") && (
              <img src={card.mediaUrl} alt="Card media" className="rounded-2xl w-full max-h-72 object-cover border mb-4" />
            )}
            {card.mediaUrl && card.type === "video" && (
              <video src={card.mediaUrl} controls className="rounded-2xl w-full border mb-4" />
            )}
            {(card.audioUrl || (card.mediaUrl && card.type === "audio")) && (
              <audio src={card.audioUrl || card.mediaUrl} controls className="w-full mb-4" />
            )}

            {card.type === "quiz" && (
              <div className="space-y-2 mt-2">
                <p className="font-medium">{card.question || card.body}</p>
                {card.options.map((option, i) => {
                  const isChosen = selected === i;
                  const isRight = selected !== null && i === Number(card.answer);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left rounded-xl border p-3 transition ${isChosen ? "border-slate-900 bg-slate-100" : "hover:bg-slate-50"} ${isRight ? "bg-emerald-50 border-emerald-300" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
                {selected !== null && <p className="text-sm text-slate-600 pt-2">{selected === Number(card.answer) ? "Correct." : "Not quite. Try reviewing the previous cards."}</p>}
              </div>
            )}

            {card.type === "poll" && (
              <div className="space-y-2 mt-2">
                <p className="font-medium">{card.question || "What do you think?"}</p>
                {card.options.map((option, i) => (
                  <button key={i} onClick={() => setSelected(i)} className={`w-full text-left rounded-xl border p-3 ${selected === i ? "bg-slate-100 border-slate-900" : "hover:bg-slate-50"}`}>{option}</button>
                ))}
                {selected !== null && <p className="text-sm text-slate-600 pt-2">Response saved in this prototype.</p>}
              </div>
            )}

            {card.type === "checklist" && (
              <div className="space-y-2 mt-2">
                {(card.items || []).map((item, i) => (
                  <label key={i} className="flex items-start gap-3 rounded-xl border p-3">
                    <input type="checkbox" className="mt-1" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="p-4 border-t flex items-center gap-2">
          <Button variant="outline" disabled={activeIndex === 0} onClick={() => { setSelected(null); setActiveIndex(Math.max(0, activeIndex - 1)); }} className="flex-1">Back</Button>
          <Button disabled={activeIndex >= course.cards.length - 1} onClick={() => { setSelected(null); setActiveIndex(Math.min(course.cards.length - 1, activeIndex + 1)); }} className="flex-1">Next</Button>
        </div>
      </div>
    </div>
  );
}

function CardEditor({ card, onChange, onDelete }) {
  const typeMeta = cardTypes.find(t => t.value === card.type);
  const Icon = typeMeta?.icon || FileQuestion;

  const update = (patch) => onChange({ ...card, ...patch });
  const updateOption = (index, value) => {
    const options = [...(card.options || [])];
    options[index] = value;
    update({ options });
  };
  const updateItem = (index, value) => {
    const items = [...(card.items || [])];
    items[index] = value;
    update({ items });
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-slate-100 p-2"><Icon className="h-4 w-4" /></div>
            <Select value={card.type} onValueChange={(type) => onChange({ ...blankCard(type), id: card.id, title: card.title, body: card.body })}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {cardTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button size="icon" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>

        <Input value={card.title} onChange={(e) => update({ title: e.target.value })} placeholder="Card title" />
        <Textarea value={card.body} onChange={(e) => update({ body: e.target.value })} placeholder="Short card text" />

        {(card.type === "image" || card.type === "video" || card.type === "audio" || card.type === "text") && (
          <Input value={card.mediaUrl || ""} onChange={(e) => update({ mediaUrl: e.target.value })} placeholder="Media URL: image, video, or audio" />
        )}
        {card.type !== "audio" && (
          <Input value={card.audioUrl || ""} onChange={(e) => update({ audioUrl: e.target.value })} placeholder="Optional narration audio URL" />
        )}

        {(card.type === "quiz" || card.type === "poll") && (
          <div className="space-y-3 rounded-xl bg-slate-50 p-3">
            <Input value={card.question || ""} onChange={(e) => update({ question: e.target.value })} placeholder="Question" />
            {(card.options || []).map((option, i) => (
              <div key={i} className="flex gap-2">
                <Input value={option} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                {card.type === "quiz" && (
                  <Button variant={Number(card.answer) === i ? "default" : "outline"} onClick={() => update({ answer: i })}>Answer</Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => update({ options: [...(card.options || []), `Option ${(card.options || []).length + 1}`] })}><Plus className="h-4 w-4 mr-2" />Add option</Button>
          </div>
        )}

        {card.type === "checklist" && (
          <div className="space-y-3 rounded-xl bg-slate-50 p-3">
            {(card.items || []).map((item, i) => (
              <Input key={i} value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder={`Checklist item ${i + 1}`} />
            ))}
            <Button variant="outline" onClick={() => update({ items: [...(card.items || []), "New checklist item"] })}><Plus className="h-4 w-4 mr-2" />Add item</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MicroTrainingBuilder() {
  const [course, setCourse] = useState(starterCourse);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [analytics, setAnalytics] = useState({ opens: 128, completions: 84, avgTime: "3m 12s", quizAvg: "78%" });

  const shareUrl = useMemo(() => {
    try { return getShareUrl(course); } catch { return "Share link unavailable in preview."; }
  }, [course]);

  const updateCard = (index, updated) => {
    const cards = [...course.cards];
    cards[index] = updated;
    setCourse({ ...course, cards });
  };

  const addCard = (type = "text") => {
    const next = blankCard(type);
    setCourse({ ...course, cards: [...course.cards, next] });
    setActiveIndex(course.cards.length);
  };

  const deleteCard = (index) => {
    const cards = course.cards.filter((_, i) => i !== index);
    setCourse({ ...course, cards });
    setActiveIndex(Math.max(0, Math.min(activeIndex, cards.length - 1)));
  };

  const copyShare = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h1 className="text-xl font-bold">TapTrain Studio</h1>
            </div>
            <p className="text-sm text-slate-500">Build quick mobile microtrainings, share by link, and test comprehension.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={copyShare}><Copy className="h-4 w-4 mr-2" />{copied ? "Copied" : "Copy link"}</Button>
            <Button><Share2 className="h-4 w-4 mr-2" />Publish</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <section>
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="mt-5 space-y-5">
              <Card className="rounded-2xl">
                <CardContent className="p-5 grid md:grid-cols-2 gap-4">
                  <Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} placeholder="Training title" />
                  <Input value={course.audience} onChange={(e) => setCourse({ ...course, audience: e.target.value })} placeholder="Audience" />
                  <Textarea className="md:col-span-2" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} placeholder="One-line description" />
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2">
                {cardTypes.map(({ value, label, icon: Icon }) => (
                  <Button key={value} variant="outline" onClick={() => addCard(value)}><Icon className="h-4 w-4 mr-2" />{label}</Button>
                ))}
              </div>

              <div className="space-y-4">
                {course.cards.map((card, i) => (
                  <div key={card.id} onClick={() => setActiveIndex(i)} className={activeIndex === i ? "ring-2 ring-slate-900 rounded-2xl" : "rounded-2xl"}>
                    <CardEditor card={card} onChange={(updated) => updateCard(i, updated)} onDelete={() => deleteCard(i)} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="share" className="mt-5">
              <Card className="rounded-2xl">
                <CardContent className="p-5 space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Share this training</h2>
                    <p className="text-sm text-slate-500">This prototype stores the course in the URL hash. A production version would save it to a database and generate a short public URL.</p>
                  </div>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly />
                    <Button onClick={copyShare}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Card><CardContent className="p-4 flex items-center gap-3"><QrCode className="h-8 w-8" /><div><p className="font-medium">QR code</p><p className="text-xs text-slate-500">Generate on publish</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center gap-3"><Share2 className="h-8 w-8" /><div><p className="font-medium">Link</p><p className="text-xs text-slate-500">Text, email, Slack</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center gap-3"><Smartphone className="h-8 w-8" /><div><p className="font-medium">Mobile-first</p><p className="text-xs text-slate-500">No app needed</p></div></CardContent></Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-5">
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(analytics).map(([key, value]) => (
                  <Card key={key} className="rounded-2xl"><CardContent className="p-5"><p className="text-sm capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p><p className="text-3xl font-bold mt-2">{value}</p></CardContent></Card>
                ))}
              </div>
              <Card className="rounded-2xl mt-4"><CardContent className="p-5"><p className="text-sm text-slate-500">Production analytics would track opens, completion, drop-off card, quiz responses, poll answers, device, and learner identity when required.</p></CardContent></Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-5">
              <Card className="rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <h2 className="text-lg font-semibold">Course settings</h2>
                  <Select value={course.theme} onValueChange={(theme) => setCourse({ ...course, theme })}>
                    <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" defaultChecked /> Require quiz completion</label>
                  <label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" /> Collect learner name/email</label>
                  <label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" /> Allow resharing</label>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <aside className="lg:sticky lg:top-24 h-fit">
          <PhonePreview course={course} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </aside>
      </main>
    </div>
  );
}
