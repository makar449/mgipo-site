import assert from 'node:assert/strict';
import { services } from '../src/features/services/data';
import { searchServices } from '../src/features/search/search';
import { applyServiceFilters } from '../src/features/services/filter';
import { leadInputSchema } from '../src/features/leads/types';
import { serviceSchema } from '../src/features/services/types';

assert.ok(services.length >= 400, 'MGIPO catalog must include imported programs.');
assert.equal(serviceSchema.safeParse(services[0]).success, true, 'First service must satisfy service schema.');

const leaderResults = searchServices(services, 'руководитель');
assert.ok(leaderResults.length > 0, 'Semantic search must return results for руководитель.');

const filtered = applyServiceFilters(services, { query: 'бухгалтер', category: 'all', format: 'all', documentType: 'all', minPrice: 0, maxPrice: 10000, onlyPopular: false, onlyNew: false, sort: 'popular' });
assert.ok(filtered.length > 0, 'Filtering must return бухгалтер programs.');

const lead = leadInputSchema.safeParse({ name: 'Иван Иванов', phone: '+7 900 000 00 00', email: 'client@example.com', serviceId: services[0]?.id, preferredContact: 'phone', consentAccepted: true, comment: 'Нужна консультация', source: 'unit-test' });
assert.equal(lead.success, true, 'Lead input schema must accept valid lead.');

console.log('Unit smoke tests passed.');
