"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Edit } from 'lucide-react';
import { DataManager } from '@/lib/data-manager';

interface ReportAuditTrailProps {
  reportId: string;
}

export default function ReportAuditTrail({ reportId }: ReportAuditTrailProps) {
  const [auditData, setAuditData] = useState<{
    createdBy: string;
    createdAt: string;
    lastModifiedBy?: string;
    lastModifiedAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuditTrail() {
      try {
        const dataManager = DataManager.getInstance();
        const data = await dataManager.getReportAuditTrail(reportId);
        setAuditData(data);
      } catch (error) {
        console.error('Error loading audit trail:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAuditTrail();
  }, [reportId]);

  if (loading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!auditData) return null;

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-slate-200 bg-linear-to-br from-slate-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Created By */}
        <div className="flex items-start gap-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <User className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-700">Created By</span>
              <Badge variant="outline" className="text-xs">
                {auditData.createdBy.split('@')[0]}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {formatDateTime(auditData.createdAt)}
            </p>
          </div>
        </div>

        {/* Last Modified By */}
        {auditData.lastModifiedBy && auditData.lastModifiedAt && (
          <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Edit className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-700">Last Modified By</span>
                <Badge variant="outline" className="text-xs bg-amber-50">
                  {auditData.lastModifiedBy.split('@')[0]}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                {formatDateTime(auditData.lastModifiedAt)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}