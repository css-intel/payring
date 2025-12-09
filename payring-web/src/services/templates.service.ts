/**
 * Templates Service
 * Manages agreement templates for quick creation
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Types
export interface AgreementTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  
  // Template content
  defaultTitle: string;
  defaultDescription: string;
  defaultTerms: string[];
  suggestedMilestones: TemplateMilestone[];
  
  // Pricing
  pricingModel: 'fixed' | 'hourly' | 'milestone' | 'custom';
  suggestedAmount?: number;
  suggestedHourlyRate?: number;
  
  // Settings
  isPublic: boolean;
  isOfficial: boolean; // PayRing official templates
  creatorId?: string;
  usageCount: number;
  rating: number;
  ratingCount: number;
  
  // Metadata
  tags: string[];
  industry?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateMilestone {
  title: string;
  description: string;
  percentageOfTotal: number;
  estimatedDays: number;
  deliverables: string[];
}

export type TemplateCategory = 
  | 'freelance'
  | 'consulting'
  | 'development'
  | 'design'
  | 'marketing'
  | 'writing'
  | 'legal'
  | 'real_estate'
  | 'services'
  | 'sales'
  | 'rental'
  | 'custom';

// Collection name
const TEMPLATES_COLLECTION = 'templates';

// Get all public templates
export async function getPublicTemplates(
  category?: TemplateCategory
): Promise<AgreementTemplate[]> {
  const templatesRef = collection(db, TEMPLATES_COLLECTION);
  let q = query(
    templatesRef,
    where('isPublic', '==', true),
    orderBy('usageCount', 'desc')
  );

  if (category) {
    q = query(q, where('category', '==', category));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as AgreementTemplate[];
}

// Get user's custom templates
export async function getUserTemplates(userId: string): Promise<AgreementTemplate[]> {
  const templatesRef = collection(db, TEMPLATES_COLLECTION);
  const q = query(
    templatesRef,
    where('creatorId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as AgreementTemplate[];
}

// Get template by ID
export async function getTemplate(templateId: string): Promise<AgreementTemplate | null> {
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as AgreementTemplate;
}

// Create custom template
export async function createTemplate(
  userId: string,
  template: Omit<AgreementTemplate, 'id' | 'creatorId' | 'usageCount' | 'rating' | 'ratingCount' | 'isOfficial' | 'createdAt' | 'updatedAt'>
): Promise<AgreementTemplate> {
  const templatesRef = collection(db, TEMPLATES_COLLECTION);
  
  const newTemplate = {
    ...template,
    creatorId: userId,
    isOfficial: false,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(templatesRef, newTemplate);

  return {
    id: docRef.id,
    ...newTemplate,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as AgreementTemplate;
}

// Update template
export async function updateTemplate(
  templateId: string,
  updates: Partial<AgreementTemplate>
): Promise<void> {
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete template
export async function deleteTemplate(templateId: string): Promise<void> {
  const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
  await deleteDoc(docRef);
}

// Increment usage count
export async function incrementTemplateUsage(templateId: string): Promise<void> {
  const template = await getTemplate(templateId);
  if (template) {
    await updateDoc(doc(db, TEMPLATES_COLLECTION, templateId), {
      usageCount: template.usageCount + 1,
    });
  }
}

// Rate template
export async function rateTemplate(
  templateId: string,
  rating: number
): Promise<void> {
  const template = await getTemplate(templateId);
  if (template) {
    const newRatingCount = template.ratingCount + 1;
    const newRating =
      (template.rating * template.ratingCount + rating) / newRatingCount;

    await updateDoc(doc(db, TEMPLATES_COLLECTION, templateId), {
      rating: newRating,
      ratingCount: newRatingCount,
    });
  }
}

// Search templates
export async function searchTemplates(
  searchTerm: string,
  options?: {
    category?: TemplateCategory;
    industry?: string;
    onlyOfficial?: boolean;
  }
): Promise<AgreementTemplate[]> {
  const templates = await getPublicTemplates(options?.category);
  
  const searchLower = searchTerm.toLowerCase();
  
  return templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesIndustry = !options?.industry || template.industry === options.industry;
    const matchesOfficial = !options?.onlyOfficial || template.isOfficial;

    return matchesSearch && matchesIndustry && matchesOfficial;
  });
}

// Default templates (seeded into database)
export const DEFAULT_TEMPLATES: Omit<
  AgreementTemplate,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Freelance Project',
    description: 'Standard freelance project agreement with milestone-based payments',
    category: 'freelance',
    defaultTitle: 'Freelance Project Agreement',
    defaultDescription: 'This agreement outlines the terms for freelance work including deliverables, timeline, and payment schedule.',
    defaultTerms: [
      'Work will be delivered according to the agreed milestones',
      'Payment will be released upon approval of each milestone',
      'Revisions are limited to 2 rounds per milestone',
      'All intellectual property transfers upon final payment',
      'Confidentiality must be maintained by both parties',
    ],
    suggestedMilestones: [
      {
        title: 'Project Kickoff & Planning',
        description: 'Initial planning, requirements gathering, and project setup',
        percentageOfTotal: 20,
        estimatedDays: 7,
        deliverables: ['Project plan', 'Requirements document', 'Timeline'],
      },
      {
        title: 'Development/Creation Phase',
        description: 'Main work phase where the core deliverables are created',
        percentageOfTotal: 50,
        estimatedDays: 21,
        deliverables: ['Core deliverables', 'Progress updates'],
      },
      {
        title: 'Review & Revisions',
        description: 'Client review and implementation of feedback',
        percentageOfTotal: 20,
        estimatedDays: 7,
        deliverables: ['Revised deliverables', 'Change log'],
      },
      {
        title: 'Final Delivery',
        description: 'Final handoff and project completion',
        percentageOfTotal: 10,
        estimatedDays: 3,
        deliverables: ['Final files', 'Documentation', 'Support handoff'],
      },
    ],
    pricingModel: 'milestone',
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['freelance', 'project', 'milestone'],
  },
  {
    name: 'Web Development',
    description: 'Website or web application development agreement',
    category: 'development',
    defaultTitle: 'Web Development Agreement',
    defaultDescription: 'Agreement for the development of a website or web application, including design, development, testing, and deployment.',
    defaultTerms: [
      'Source code will be provided upon final payment',
      'Hosting and domain are client responsibility unless agreed otherwise',
      'Bug fixes are included for 30 days after launch',
      'Additional features beyond scope require separate agreement',
      'Client must provide content and assets in timely manner',
    ],
    suggestedMilestones: [
      {
        title: 'Discovery & Design',
        description: 'Requirements analysis, wireframes, and design mockups',
        percentageOfTotal: 25,
        estimatedDays: 14,
        deliverables: ['Wireframes', 'Design mockups', 'Technical specifications'],
      },
      {
        title: 'Frontend Development',
        description: 'Building the user interface and client-side functionality',
        percentageOfTotal: 25,
        estimatedDays: 14,
        deliverables: ['Responsive UI', 'Interactive components'],
      },
      {
        title: 'Backend Development',
        description: 'Server-side logic, database, and API development',
        percentageOfTotal: 25,
        estimatedDays: 14,
        deliverables: ['API endpoints', 'Database setup', 'Authentication'],
      },
      {
        title: 'Testing & Launch',
        description: 'QA testing, bug fixes, and deployment',
        percentageOfTotal: 25,
        estimatedDays: 7,
        deliverables: ['Test reports', 'Live deployment', 'Documentation'],
      },
    ],
    pricingModel: 'milestone',
    suggestedAmount: 5000,
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['web', 'development', 'website', 'app'],
    industry: 'technology',
  },
  {
    name: 'Graphic Design',
    description: 'Logo, branding, or graphic design project',
    category: 'design',
    defaultTitle: 'Graphic Design Agreement',
    defaultDescription: 'Agreement for graphic design services including concept development, revisions, and final file delivery.',
    defaultTerms: [
      'Initial concepts will include 3 design directions',
      'Two rounds of revisions included',
      'Additional revisions billed at hourly rate',
      'Final files delivered in all standard formats',
      'Full ownership transfers upon final payment',
    ],
    suggestedMilestones: [
      {
        title: 'Brief & Research',
        description: 'Understanding requirements and market research',
        percentageOfTotal: 15,
        estimatedDays: 3,
        deliverables: ['Creative brief', 'Mood board', 'Research findings'],
      },
      {
        title: 'Initial Concepts',
        description: 'First round of design concepts',
        percentageOfTotal: 35,
        estimatedDays: 7,
        deliverables: ['3 design concepts', 'Presentation'],
      },
      {
        title: 'Refinement',
        description: 'Refining chosen concept based on feedback',
        percentageOfTotal: 35,
        estimatedDays: 5,
        deliverables: ['Refined designs', 'Variations'],
      },
      {
        title: 'Final Delivery',
        description: 'Final files and brand guidelines',
        percentageOfTotal: 15,
        estimatedDays: 2,
        deliverables: ['Final files (AI, PSD, PNG, SVG)', 'Brand guidelines'],
      },
    ],
    pricingModel: 'fixed',
    suggestedAmount: 1500,
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['design', 'graphic', 'logo', 'branding'],
    industry: 'creative',
  },
  {
    name: 'Consulting Retainer',
    description: 'Monthly consulting services agreement',
    category: 'consulting',
    defaultTitle: 'Consulting Retainer Agreement',
    defaultDescription: 'Ongoing consulting services agreement with monthly retainer and defined scope of work.',
    defaultTerms: [
      'Retainer covers up to agreed hours per month',
      'Unused hours do not roll over',
      'Additional hours billed at standard rate',
      'Monthly reports will be provided',
      'Either party may terminate with 30 days notice',
    ],
    suggestedMilestones: [
      {
        title: 'Month 1',
        description: 'First month of consulting services',
        percentageOfTotal: 33,
        estimatedDays: 30,
        deliverables: ['Monthly report', 'Recommendations'],
      },
      {
        title: 'Month 2',
        description: 'Second month of consulting services',
        percentageOfTotal: 33,
        estimatedDays: 30,
        deliverables: ['Monthly report', 'Progress review'],
      },
      {
        title: 'Month 3',
        description: 'Third month of consulting services',
        percentageOfTotal: 34,
        estimatedDays: 30,
        deliverables: ['Final report', 'Recommendations for next steps'],
      },
    ],
    pricingModel: 'hourly',
    suggestedHourlyRate: 150,
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['consulting', 'retainer', 'advisory'],
    industry: 'professional_services',
  },
  {
    name: 'Content Writing',
    description: 'Blog posts, articles, or copywriting services',
    category: 'writing',
    defaultTitle: 'Content Writing Agreement',
    defaultDescription: 'Agreement for content creation services including research, writing, and revisions.',
    defaultTerms: [
      'Content will be original and plagiarism-free',
      'One round of revisions included',
      'SEO optimization included where applicable',
      'Full ownership transfers upon payment',
      'Byline/credit as mutually agreed',
    ],
    suggestedMilestones: [
      {
        title: 'Research & Outline',
        description: 'Topic research and content outline',
        percentageOfTotal: 25,
        estimatedDays: 3,
        deliverables: ['Research notes', 'Content outline'],
      },
      {
        title: 'First Draft',
        description: 'Complete first draft of content',
        percentageOfTotal: 50,
        estimatedDays: 5,
        deliverables: ['First draft'],
      },
      {
        title: 'Final Delivery',
        description: 'Revisions and final delivery',
        percentageOfTotal: 25,
        estimatedDays: 2,
        deliverables: ['Final content', 'Meta descriptions'],
      },
    ],
    pricingModel: 'fixed',
    suggestedAmount: 500,
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['writing', 'content', 'copywriting', 'blog'],
    industry: 'marketing',
  },
  {
    name: 'Simple Payment Agreement',
    description: 'Basic one-time payment agreement for goods or services',
    category: 'services',
    defaultTitle: 'Payment Agreement',
    defaultDescription: 'Simple agreement for a one-time payment in exchange for specified goods or services.',
    defaultTerms: [
      'Payment is due upon delivery/completion',
      'Goods/services as described in this agreement',
      'Both parties agree to the specified amount',
      'Disputes to be resolved through PayRing mediation',
    ],
    suggestedMilestones: [
      {
        title: 'Full Payment',
        description: 'Complete payment upon delivery',
        percentageOfTotal: 100,
        estimatedDays: 1,
        deliverables: ['Goods/services as agreed'],
      },
    ],
    pricingModel: 'fixed',
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['simple', 'payment', 'one-time'],
  },
  {
    name: 'Room/Property Rental',
    description: 'Short-term rental agreement for property or equipment',
    category: 'rental',
    defaultTitle: 'Rental Agreement',
    defaultDescription: 'Agreement for temporary rental of property, equipment, or space.',
    defaultTerms: [
      'Security deposit required and refundable upon return in good condition',
      'Renter responsible for any damages during rental period',
      'Property must be returned by agreed date',
      'No subleasing without written permission',
      'Cancellation policy as specified',
    ],
    suggestedMilestones: [
      {
        title: 'Security Deposit',
        description: 'Refundable security deposit',
        percentageOfTotal: 30,
        estimatedDays: 1,
        deliverables: ['Access to property/equipment'],
      },
      {
        title: 'Rental Payment',
        description: 'Payment for rental period',
        percentageOfTotal: 70,
        estimatedDays: 1,
        deliverables: ['Rental period begins'],
      },
    ],
    pricingModel: 'fixed',
    isPublic: true,
    isOfficial: true,
    usageCount: 0,
    rating: 0,
    ratingCount: 0,
    tags: ['rental', 'property', 'equipment'],
    industry: 'real_estate',
  },
];

// Seed default templates (call once during setup)
export async function seedDefaultTemplates(): Promise<void> {
  const existingTemplates = await getPublicTemplates();
  const officialTemplates = existingTemplates.filter((t) => t.isOfficial);

  if (officialTemplates.length === 0) {
    const templatesRef = collection(db, TEMPLATES_COLLECTION);
    
    for (const template of DEFAULT_TEMPLATES) {
      await addDoc(templatesRef, {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    console.log('Default templates seeded successfully');
  }
}

// Template categories with metadata
export const TEMPLATE_CATEGORIES: {
  value: TemplateCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: 'freelance',
    label: 'Freelance',
    icon: '💼',
    description: 'General freelance project agreements',
  },
  {
    value: 'consulting',
    label: 'Consulting',
    icon: '🎯',
    description: 'Advisory and consulting services',
  },
  {
    value: 'development',
    label: 'Development',
    icon: '💻',
    description: 'Software and web development',
  },
  {
    value: 'design',
    label: 'Design',
    icon: '🎨',
    description: 'Graphic and UI/UX design',
  },
  {
    value: 'marketing',
    label: 'Marketing',
    icon: '📈',
    description: 'Marketing and advertising services',
  },
  {
    value: 'writing',
    label: 'Writing',
    icon: '✍️',
    description: 'Content and copywriting',
  },
  {
    value: 'legal',
    label: 'Legal',
    icon: '⚖️',
    description: 'Legal services and contracts',
  },
  {
    value: 'real_estate',
    label: 'Real Estate',
    icon: '🏠',
    description: 'Property and real estate',
  },
  {
    value: 'services',
    label: 'Services',
    icon: '🛠️',
    description: 'General services',
  },
  {
    value: 'sales',
    label: 'Sales',
    icon: '🤝',
    description: 'Sales and purchase agreements',
  },
  {
    value: 'rental',
    label: 'Rental',
    icon: '🔑',
    description: 'Rental agreements',
  },
  {
    value: 'custom',
    label: 'Custom',
    icon: '📝',
    description: 'Custom agreements',
  },
];
