import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { LeadPriority, LeadStatus } from '@/features/leads/types';

type LocalLeadEvent = {
  id: string;
  leadId: string;
  fromStatus: LeadStatus | null;
  toStatus: LeadStatus | null;
  actorEmail: string | null;
  note: string | null;
  createdAt: string;
};

export type LocalLead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  serviceId: string;
  serviceTitle: string;
  comment: string | null;
  source: string;
  preferredContact: string;
  consentAccepted: boolean;
  status: LeadStatus;
  priority: LeadPriority;
  managerNote: string | null;
  lastStatusChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  events: ReadonlyArray<LocalLeadEvent>;
};

type LocalLeadCreateInput = {
  name: string;
  phone: string;
  email?: string | undefined;
  serviceId: string;
  serviceTitle: string;
  comment?: string | undefined;
  source: string;
  preferredContact: string;
  consentAccepted: boolean;
  priority: LeadPriority;
};

type LocalLeadUpdateInput = {
  id: string;
  status: LeadStatus;
  priority?: LeadPriority | undefined;
  managerNote?: string | undefined;
  actorEmail: string;
};

const dataDirectory = path.join(process.cwd(), '.local-data');
const leadsFilePath = path.join(dataDirectory, 'leads.json');

async function ensureDataDirectory(): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
}

function normalizeLead(value: unknown): LocalLead | null {
  if (value === null || typeof value !== 'object') return null;
  const candidate = value as Partial<LocalLead>;
  if (typeof candidate.id !== 'string') return null;
  if (typeof candidate.name !== 'string') return null;
  if (typeof candidate.phone !== 'string') return null;
  if (typeof candidate.serviceId !== 'string') return null;
  if (typeof candidate.serviceTitle !== 'string') return null;
  if (candidate.status !== 'NEW' && candidate.status !== 'IN_PROGRESS' && candidate.status !== 'PROCESSED' && candidate.status !== 'REJECTED') return null;
  if (candidate.priority !== 'LOW' && candidate.priority !== 'NORMAL' && candidate.priority !== 'HIGH') return null;
  if (typeof candidate.createdAt !== 'string') return null;
  if (typeof candidate.updatedAt !== 'string') return null;
  return {
    id: candidate.id,
    name: candidate.name,
    phone: candidate.phone,
    email: typeof candidate.email === 'string' ? candidate.email : null,
    serviceId: candidate.serviceId,
    serviceTitle: candidate.serviceTitle,
    comment: typeof candidate.comment === 'string' ? candidate.comment : null,
    source: typeof candidate.source === 'string' ? candidate.source : 'website',
    preferredContact: typeof candidate.preferredContact === 'string' ? candidate.preferredContact : 'phone',
    consentAccepted: typeof candidate.consentAccepted === 'boolean' ? candidate.consentAccepted : true,
    status: candidate.status,
    priority: candidate.priority,
    managerNote: typeof candidate.managerNote === 'string' ? candidate.managerNote : null,
    lastStatusChangedAt: typeof candidate.lastStatusChangedAt === 'string' ? candidate.lastStatusChangedAt : null,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    events: Array.isArray(candidate.events) ? candidate.events.filter((event): event is LocalLeadEvent => event !== null && typeof event === 'object' && typeof (event as LocalLeadEvent).id === 'string') : []
  };
}

async function readLocalLeadsFile(): Promise<ReadonlyArray<LocalLead>> {
  try {
    const raw = await readFile(leadsFilePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeLead).filter((lead): lead is LocalLead => lead !== null);
  } catch {
    return [];
  }
}

async function writeLocalLeadsFile(leads: ReadonlyArray<LocalLead>): Promise<void> {
  await ensureDataDirectory();
  await writeFile(leadsFilePath, JSON.stringify(leads, null, 2), 'utf8');
}

export async function createLocalLead(input: LocalLeadCreateInput): Promise<LocalLead> {
  const leads = await readLocalLeadsFile();
  const now = new Date().toISOString();
  const id = `local_${randomUUID()}`;
  const event: LocalLeadEvent = {
    id: `event_${randomUUID()}`,
    leadId: id,
    fromStatus: null,
    toStatus: 'NEW',
    actorEmail: null,
    note: 'Заявка создана через форму сайта и сохранена локально, потому что PostgreSQL не подключён.',
    createdAt: now
  };
  const lead: LocalLead = {
    id,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    serviceId: input.serviceId,
    serviceTitle: input.serviceTitle,
    comment: input.comment ?? null,
    source: input.source,
    preferredContact: input.preferredContact,
    consentAccepted: input.consentAccepted,
    status: 'NEW',
    priority: input.priority,
    managerNote: null,
    lastStatusChangedAt: null,
    createdAt: now,
    updatedAt: now,
    events: [event]
  };
  await writeLocalLeadsFile([lead, ...leads]);
  return lead;
}

export async function listLocalLeads(options: { status: LeadStatus | null; query: string }): Promise<ReadonlyArray<LocalLead>> {
  const normalizedQuery = options.query.trim().toLowerCase();
  const leads = await readLocalLeadsFile();
  return leads
    .filter((lead) => options.status === null || lead.status === options.status)
    .filter((lead) => {
      if (normalizedQuery.length === 0) return true;
      const haystack = [lead.name, lead.phone, lead.email ?? '', lead.serviceTitle, lead.comment ?? ''].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export async function updateLocalLead(input: LocalLeadUpdateInput): Promise<LocalLead | null> {
  const leads = await readLocalLeadsFile();
  const index = leads.findIndex((lead) => lead.id === input.id);
  if (index === -1) return null;
  const current = leads[index];
  if (current === undefined) return null;
  const now = new Date().toISOString();
  const event: LocalLeadEvent = {
    id: `event_${randomUUID()}`,
    leadId: current.id,
    fromStatus: current.status,
    toStatus: input.status,
    actorEmail: input.actorEmail,
    note: input.managerNote ?? null,
    createdAt: now
  };
  const updated: LocalLead = {
    ...current,
    status: input.status,
    priority: input.priority ?? current.priority,
    managerNote: input.managerNote ?? current.managerNote,
    lastStatusChangedAt: current.status === input.status ? current.lastStatusChangedAt : now,
    updatedAt: now,
    events: [event, ...current.events].slice(0, 12)
  };
  const nextLeads = [...leads];
  nextLeads[index] = updated;
  await writeLocalLeadsFile(nextLeads);
  return updated;
}
