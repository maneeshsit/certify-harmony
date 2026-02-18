import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { RatingBadge, RatingBar, LevelIndicator } from '@/components/RatingBadge';
import { mockSocieties } from '@/lib/mockData';
import { Society, ASSESSMENT_CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Plus, X, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [societies, setSocieties] = useState<Society[]>(mockSocieties);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [newSociety, setNewSociety] = useState({ name: '', address: '', city: '', totalUnits: 50, yearBuilt: 2020 });
  const [newScores, setNewScores] = useState<Record<string, number>>(
    Object.fromEntries(ASSESSMENT_CATEGORIES.map(c => [c.key, 3]))
  );

  if (!user) return <Navigate to="/login" replace />;

  const filtered = societies.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const calculateLevel = (scores: Record<string, number>) => {
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    return Math.round(avg);
  };

  const handleAddSociety = () => {
    if (!newSociety.name) return;
    const level = calculateLevel(newScores);
    const society: Society = {
      id: crypto.randomUUID(),
      ...newSociety,
      overallLevel: level,
      leedScore: Math.round((Object.values(newScores).reduce((a, b) => a + b, 0) / 50) * 100),
      lastAssessed: new Date().toISOString().split('T')[0],
      scores: newScores as any,
      compliance: [],
    };
    setSocieties(prev => [society, ...prev]);
    setShowAssessment(false);
    setNewSociety({ name: '', address: '', city: '', totalUnits: 50, yearBuilt: 2020 });
    setNewScores(Object.fromEntries(ASSESSMENT_CATEGORIES.map(c => [c.key, 3])));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Society Dashboard</h1>
            <p className="text-muted-foreground">Manage and assess cooperative housing societies</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 w-64" placeholder="Search societies..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button onClick={() => setShowAssessment(!showAssessment)}>
              {showAssessment ? <X className="mr-1.5 h-4 w-4" /> : <Plus className="mr-1.5 h-4 w-4" />}
              {showAssessment ? 'Cancel' : 'New Assessment'}
            </Button>
          </div>
        </div>

        {/* New Assessment Form */}
        <AnimatePresence>
          {showAssessment && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card className="mb-8 border-secondary/30">
                <CardHeader>
                  <CardTitle className="text-secondary">New Society Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div><Label>Society Name</Label><Input value={newSociety.name} onChange={e => setNewSociety({ ...newSociety, name: e.target.value })} placeholder="ABC CHS Ltd" /></div>
                    <div><Label>Address</Label><Input value={newSociety.address} onChange={e => setNewSociety({ ...newSociety, address: e.target.value })} placeholder="123 Main Road" /></div>
                    <div><Label>City</Label><Input value={newSociety.city} onChange={e => setNewSociety({ ...newSociety, city: e.target.value })} placeholder="Mumbai" /></div>
                  </div>
                  <h3 className="font-semibold mb-4 text-primary">Rate Each Category (1-5)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {ASSESSMENT_CATEGORIES.map(cat => (
                      <div key={cat.key} className="flex items-center gap-3">
                        <span className="w-44 text-sm truncate">{cat.label}</span>
                        <Slider min={1} max={5} step={1} value={[newScores[cat.key]]} onValueChange={v => setNewScores({ ...newScores, [cat.key]: v[0] })} className="flex-1" />
                        <Badge variant="outline" className="w-8 justify-center">{newScores[cat.key]}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Calculated Level:</span>
                      <RatingBadge level={calculateLevel(newScores)} size="sm" />
                    </div>
                    <Button onClick={handleAddSociety} disabled={!newSociety.name}>Submit Assessment</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Societies List */}
        <div className="space-y-4">
          {filtered.map(society => (
            <motion.div key={society.id} layout>
              <Card className="transition-shadow hover:shadow-md cursor-pointer" onClick={() => setExpandedId(expandedId === society.id ? null : society.id)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <RatingBadge level={society.overallLevel} />
                      <div>
                        <h3 className="font-semibold text-card-foreground">{society.name}</h3>
                        <p className="text-sm text-muted-foreground">{society.address}, {society.city}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline"><Building2 className="mr-1 h-3 w-3" />{society.totalUnits} units</Badge>
                          <Badge variant="outline" className="text-secondary border-secondary/30"><Leaf className="mr-1 h-3 w-3" />LEED: {society.leedScore}/100</Badge>
                          <Badge variant="secondary">Assessed: {society.lastAssessed}</Badge>
                        </div>
                        <div className="mt-2">
                          <LevelIndicator level={society.overallLevel} compact />
                        </div>
                      </div>
                    </div>
                    {expandedId === society.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>

                  <AnimatePresence>
                    {expandedId === society.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 border-t border-border pt-5"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h4 className="mb-3 font-semibold text-primary">Assessment Scores</h4>
                            <RatingBar scores={society.scores as unknown as { [key: string]: number }} />
                          </div>
                          <div>
                            <h4 className="mb-3 font-semibold text-primary">Compliance Certificates</h4>
                            {society.compliance.length > 0 ? (
                              <div className="space-y-2">
                                {society.compliance.map(cert => (
                                  <div key={cert.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                                    <span className="truncate">{cert.name}</span>
                                    <Badge variant={cert.status === 'valid' ? 'default' : cert.status === 'expired' ? 'destructive' : 'secondary'} className="ml-2 shrink-0">
                                      {cert.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No compliance certificates recorded yet.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <Building2 className="mx-auto mb-3 h-12 w-12 opacity-30" />
            <p>No societies found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
