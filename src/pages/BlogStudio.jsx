import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BlogList } from '../components/studio/BlogList';
import { BlogGenerator } from '../components/studio/BlogGenerator';
import { BlogEditor } from '../components/studio/BlogEditor';
import { BlogPreview } from '../components/studio/BlogPreview';
import {
  Building2,
  Users2,
  BookOpen,
  Compass,
  Search,
  Sparkles,
  FileText,
  Eye,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const BlogStudio = () => {
  const [showWorkflowHelper, setShowWorkflowHelper] = React.useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const view = searchParams.get('view') || 'list';
  const id = searchParams.get('id');

  // Fetch blogs list
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs-list'],
    queryFn: async () => {
      const response = await api.get('/blogs');
      return response.data.data || [];
    }
  });

  // Fetch company data
  const { data: companyData } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const response = await api.get('/company');
      return response.data.data;
    }
  });

  // Fetch personas data
  const { data: personasData = [] } = useQuery({
    queryKey: ['personas'],
    queryFn: async () => {
      const response = await api.get('/personas');
      return response.data.data || [];
    }
  });

  // Fetch knowledge base files data
  const { data: documentsData = [] } = useQuery({
    queryKey: ['knowledge'],
    queryFn: async () => {
      const response = await api.get('/knowledge');
      return response.data.data || [];
    }
  });

  const isProfileComplete = !!(
    companyData?.companyName &&
    companyData?.website &&
    companyData?.logo &&
    companyData?.productDescription &&
    companyData?.targetAudience
  );
  const hasPersonas = personasData && personasData.length > 0;
  const hasDocuments = documentsData && documentsData.length > 0;

  const workflowSteps = [
    { id: 1, name: 'Define Company', done: isProfileComplete, icon: Building2, stepNum: '01', desc: 'Define your business name, audience, and core product.' },
    { id: 2, name: 'Create Persona', done: hasPersonas, icon: Users2, stepNum: '02', desc: 'Build target customer buyer personas for grounding.' },
    { id: 3, name: 'Grounding Docs', done: hasDocuments, icon: BookOpen, optional: true, stepNum: '03', desc: 'Upload knowledge files to source accurate facts.' },
    { id: 4, name: 'Create Topic', done: false, icon: Compass, stepNum: '04', desc: 'Set up your topic keywords, outline, and target persona.' },
    { id: 5, name: 'Market Research', done: false, icon: Search, stepNum: '05', desc: 'Audit competitors search gaps and trending news.' },
    { id: 6, name: 'Generate', done: false, icon: Sparkles, stepNum: '06', desc: 'AI writer outlines, drafts, and runs canonical SEO quality checks.' },
    { id: 7, name: 'Adapt & Render', done: false, icon: Eye, stepNum: '07', desc: 'Generate custom cover art and render customized adaptations for social platforms.' }
  ];

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('view', 'list');
    setSearchParams(params);
  };

  const setView = (viewName, idVal = null) => {
    const params = new URLSearchParams();
    params.set('view', viewName);
    if (idVal) params.set('id', idVal);
    setSearchParams(params);
  };

  return (
    <div className="space-y-6 relative max-w-6xl mx-auto py-6 px-4">
      
      {view === 'list' && (
        <div className="space-y-6">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Blog Studio</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Generate high-quality SEO blogs completely aligned with your verified corporate style guidelines.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => navigate('/brand-setup')}
                className="px-4 py-2 border border-border bg-card hover:bg-muted/40 text-foreground font-semibold rounded-xl text-xs shadow-sm cursor-pointer transition-colors"
              >
                Brand Settings
              </button>
              {blogs.length > 0 && (
                <button
                  onClick={() => setShowWorkflowHelper(!showWorkflowHelper)}
                  className={`px-4 py-2 border font-semibold rounded-xl text-xs shadow-sm cursor-pointer transition-all ${
                    showWorkflowHelper 
                      ? 'bg-primary/10 border-primary/20 text-primary' 
                      : 'bg-card border-border text-foreground hover:bg-muted/40'
                  }`}
                >
                  {showWorkflowHelper ? 'Hide Workflow' : 'Show Workflow'}
                </button>
              )}
            </div>
          </div>

          {/* Banner notification for incomplete brand config */}
          {(!isProfileComplete || !hasPersonas) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="shrink-0" />
                <div>
                  <span className="font-bold">Brand Setup Incomplete:</span> Your generation engine currently lacks target business grounding context.
                </div>
              </div>
              <button 
                onClick={() => navigate('/brand-setup')}
                className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap self-start sm:self-center"
              >
                Complete Brand Setup
              </button>
            </div>
          )}

          {/* Collapsible Helper Guide for active lists */}
          {blogs.length > 0 && showWorkflowHelper && (
            <div className="bg-card rounded-3xl p-6 border border-border text-left space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                <CheckCircle2 size={16} className="shrink-0" />
                <div>
                  <span className="font-bold">Brand Setup Complete:</span> Your target profiles and buyer personas are fully configured to ground the AI writer.
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <Compass size={16} className="text-primary" />
                  <span>Grounded Blog Generation Workflow</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { step: '01', title: 'Create Blog Topic', desc: 'Select "Generate New Blog", fill details, persona, and SEO keywords.', icon: Compass },
                  { step: '02', title: 'AI Market Research', desc: 'AI audits competitor gaps, search volumes, and trending news.', icon: Search },
                  { step: '03', title: 'Custom Hook Angle', desc: 'Pick an AI suggested copy angle or write a custom theme hook (optional).', icon: Sparkles },
                  { step: '04', title: 'Draft Grounded Blog', desc: 'AI writer outlines, drafts, and runs canonical SEO quality checks.', icon: FileText },
                  { step: '05', title: 'Adapt & Render', desc: 'Generate custom cover art and render customized adaptations for social platforms.', icon: Eye }
                ].map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-muted/5 border border-border p-4 rounded-2xl relative flex flex-col justify-between hover:border-primary/30 hover:bg-muted/20 transition-all duration-300"
                    >
                      <span className="absolute top-2.5 right-3 text-[10px] font-bold font-mono text-muted-foreground/60">
                        {item.step}
                      </span>
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-3">
                          <ItemIcon size={14} />
                        </div>
                        <h4 className="font-display text-xs font-bold text-foreground mb-1.5">{item.title}</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State Pipeline overview */}
          {blogs.length === 0 && (
            <div className="bg-card rounded-3xl p-6 border border-border text-left space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <Compass size={16} className="text-primary" />
                  <span>How Blog Studio Works</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {(() => {
                  const activeStepIndex = workflowSteps.findIndex(step => !step.done);
                  return workflowSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActiveStep = index === activeStepIndex;
                    return (
                      <div 
                        key={step.id} 
                        className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-300 border min-h-[155px] overflow-hidden hover:scale-[1.03] ${
                          step.done 
                            ? 'bg-primary/[0.02] border-primary/30 hover:border-primary/55' 
                            : isActiveStep
                            ? 'bg-primary/[0.03] border-primary/45 shadow-[0_0_12px_rgba(242,91,24,0.08)]'
                            : 'bg-muted/5 border-border hover:border-primary/20 hover:bg-muted/10'
                        }`}
                      >
                        <span className={`absolute top-2.5 right-3 text-[9px] font-bold tracking-wider font-mono ${
                          step.done ? 'text-primary/50' : isActiveStep ? 'text-primary/70' : 'text-muted-foreground/60'
                        }`}>
                          {step.stepNum}
                        </span>

                        <div className="flex flex-col items-center text-center w-full mt-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${
                            step.done 
                              ? 'bg-gradient-to-r from-primary to-accent text-white border border-transparent shadow-md' 
                              : isActiveStep
                              ? 'bg-primary/20 text-primary border border-primary/35 shadow-sm'
                              : 'bg-primary/5 text-primary/60 border border-primary/10 group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            <StepIcon size={14} />
                          </div>

                          <div className="mt-3 space-y-1">
                            <div className={`text-[11px] font-bold leading-tight transition-colors duration-300 ${
                              step.done ? 'text-foreground font-extrabold' : isActiveStep ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                            }`}>
                              {step.name}
                            </div>
                            <div className="text-[9px] text-muted-foreground/80 font-normal leading-normal select-none transition-colors duration-300">
                              {step.desc}
                            </div>
                          </div>
                        </div>

                        {step.done ? (
                          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10 rounded-t-full shadow-sm" />
                        ) : isActiveStep ? (
                          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 rounded-t-full" />
                        ) : null}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Switch Render Views */}
      <div className="animate-fade-in">
        {view === 'list' && (
          <BlogList
            onOpenEditor={(blogId) => setView('edit', blogId)}
            onOpenPreview={(blogId) => setView('preview', blogId)}
            onOpenGenerate={(options) => {
              if (options) {
                const params = new URLSearchParams();
                params.set('view', 'generate');
                if (options.topicName) params.set('suggestedTopicName', options.topicName);
                if (options.topicDetail) params.set('suggestedTopicDetail', options.topicDetail);
                if (options.topicGoal) params.set('suggestedTopicGoal', options.topicGoal);
                setSearchParams(params);
              } else {
                setView('generate');
              }
            }}
          />
        )}

        {view === 'generate' && (
          <BlogGenerator
            initialTopicId={searchParams.get('topicId')}
            initialCustomAngle={searchParams.get('customAngle')}
            onBack={handleBack}
            onGenerationComplete={(blogId) => setView('preview', blogId)}
          />
        )}

        {view === 'edit' && id && (
          <BlogEditor
            blogId={id}
            onBack={handleBack}
          />
        )}

        {view === 'preview' && id && (
          <BlogPreview
            blogId={id}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default BlogStudio;