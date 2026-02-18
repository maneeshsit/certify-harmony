import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockSocieties } from '@/lib/mockData';
import { Society, COMPLIANCE_CERTIFICATES, RATING_LEVELS } from '@/lib/types';
import { generateSocietyReport, generateComplianceCertificate } from '@/lib/pdfGenerator';
import { RatingBadge, LevelIndicator } from '@/components/RatingBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Award, Shield, BarChart3, Building2, AlertTriangle } from 'lucide-react';
import logo from '@/assets/logo.png';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [selectedSociety, setSelectedSociety] = useState<string>(mockSocieties[0]?.id || '');
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
      setLogoDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = logo;
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  const society = mockSocieties.find(s => s.id === selectedSociety) || mockSocieties[0];

  const stats = {
    total: mockSocieties.length,
    avgLevel: Math.round(mockSocieties.reduce((a, s) => a + s.overallLevel, 0) / mockSocieties.length * 10) / 10,
    avgLeed: Math.round(mockSocieties.reduce((a, s) => a + s.leedScore, 0) / mockSocieties.length),
    expiredCerts: mockSocieties.reduce((a, s) => a + s.compliance.filter(c => c.status === 'expired').length, 0),
  };

  const handleDownloadReport = () => {
    if (society) generateSocietyReport(society, logoDataUrl);
  };

  const handleDownloadCert = (certName: string) => {
    if (society) generateComplianceCertificate(society, certName, logoDataUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Generate reports, manage certifications, and oversee compliance</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Societies', value: stats.total, icon: Building2, color: 'text-primary' },
            { label: 'Avg Rating Level', value: stats.avgLevel, icon: BarChart3, color: 'text-secondary' },
            { label: 'Avg LEED Score', value: stats.avgLeed, icon: Award, color: 'text-accent' },
            { label: 'Expired Certificates', value: stats.expiredCerts, icon: AlertTriangle, color: 'text-destructive' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Society selector */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Select Society:</span>
          <Select value={selectedSociety} onValueChange={setSelectedSociety}>
            <SelectTrigger className="w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockSocieties.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {society && <RatingBadge level={society.overallLevel} size="sm" />}
        </div>

        <Tabs defaultValue="reports">
          <TabsList className="mb-6">
            <TabsTrigger value="reports"><FileText className="mr-1.5 h-4 w-4" />Reports</TabsTrigger>
            <TabsTrigger value="compliance"><Shield className="mr-1.5 h-4 w-4" />Compliance</TabsTrigger>
            <TabsTrigger value="certifications"><Award className="mr-1.5 h-4 w-4" />Certifications</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Assessment Report</CardTitle>
              </CardHeader>
              <CardContent>
                {society && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{society.name}</h3>
                          <p className="text-sm text-muted-foreground">{society.address}, {society.city}</p>
                        </div>
                        <div className="text-right">
                          <RatingBadge level={society.overallLevel} />
                          <p className="mt-1 text-xs text-muted-foreground">LEED Score: {society.leedScore}/100</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <LevelIndicator level={society.overallLevel} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleDownloadReport} className="gradient-green text-secondary-foreground border-0 hover:opacity-90">
                        <Download className="mr-1.5 h-4 w-4" />
                        Download Full Report (PDF)
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Report includes assessment scores, compliance status, and CHS Rate watermark.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Mandatory Compliance Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {COMPLIANCE_CERTIFICATES.map((cert, i) => {
                    const existing = society?.compliance.find(c => c.name === cert.name);
                    return (
                      <div key={i} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                        <div className="flex items-center gap-3">
                          {cert.mandatory ? (
                            <Badge variant="destructive" className="text-[10px]">MANDATORY</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">OPTIONAL</Badge>
                          )}
                          <div>
                            <p className="text-sm font-medium">{cert.name}</p>
                            <p className="text-xs text-muted-foreground">{cert.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {existing ? (
                            <Badge variant={existing.status === 'valid' ? 'default' : existing.status === 'expired' ? 'destructive' : 'secondary'}>
                              {existing.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Recorded</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle>Generate Compliance Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Generate branded PDF certificates with watermark for any compliance category.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {COMPLIANCE_CERTIFICATES.filter(c => c.mandatory).map((cert, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.category}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadCert(cert.name)}>
                        <Download className="mr-1 h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
