'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Route, Plus, Edit2, Trash2, X, Check, Globe, Clock, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sight {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  walk_minutes: number | null;
  entrance: string | null;
  url: string | null;
  image: string | null;
  description: Record<string, string>;
}

interface TouristRoute {
  id: string;
  route_id: string;
  category: string;
  duration: string | null;
  distance: string | null;
  difficulty: string | null;
  image: string | null;
  title: Record<string, string>;
  description: Record<string, string>;
  stops: Array<{
    name: string;
    lat: number;
    lng: number;
    description?: Record<string, string>;
  }>;
}

const CATEGORIES = [
  { value: 'monument', label: 'Monumento', icon: '🏛️' },
  { value: 'neighborhood', label: 'Barrio', icon: '🏘️' },
  { value: 'culture', label: 'Cultura', icon: '🎭' },
  { value: 'food', label: 'Gastronomía', icon: '🍽️' },
  { value: 'nature', label: 'Naturaleza', icon: '🌳' },
  { value: 'modern', label: 'Moderno', icon: '🏙️' },
  { value: 'fun', label: 'Ocio', icon: '🎢' },
];

const ROUTE_CATEGORIES = [
  { value: 'classic', label: 'Clásica', icon: '🏛️' },
  { value: 'neighborhoods', label: 'Barrios', icon: '🏘️' },
  { value: 'romantic', label: 'Romántica', icon: '💕' },
  { value: 'food', label: 'Gastronómica', icon: '🍷' },
  { value: 'family', label: 'Familiar', icon: '👨‍👩‍👧‍👦' },
  { value: 'culture', label: 'Cultural', icon: '🎨' },
  { value: 'nature', label: 'Naturaleza', icon: '🌿' },
  { value: 'shopping', label: 'Compras', icon: '🛍️' },
  { value: 'photos', label: 'Fotográfica', icon: '📸' },
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil', color: 'text-green-600' },
  { value: 'moderate', label: 'Moderada', color: 'text-yellow-600' },
  { value: 'hard', label: 'Difícil', color: 'text-red-600' },
];

const LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const LANG_LABELS: Record<string, string> = {
  es: '🇪🇸 Español', en: '🇬🇧 English', fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch', it: '🇮🇹 Italiano', pt: '🇵🇹 Português',
};

export default function SightsRoutesManager() {
  const [activeTab, setActiveTab] = useState<'sights' | 'routes'>('sights');
  const [sights, setSights] = useState<Sight[]>([]);
  const [routes, setRoutes] = useState<TouristRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSight, setEditingSight] = useState<Sight | null>(null);
  const [editingRoute, setEditingRoute] = useState<TouristRoute | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [langTab, setLangTab] = useState('es');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sightsRes, routesRes] = await Promise.all([
        fetch('/api/admin/sights'),
        fetch('/api/admin/routes'),
      ]);
      const sightsData = await sightsRes.json();
      const routesData = await routesRes.json();
      setSights(sightsData.sights || []);
      setRoutes(routesData.routes || []);
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteSight = async (id: string) => {
    if (!confirm('¿Eliminar este punto de interés?')) return;
    await fetch('/api/admin/sights', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  const deleteRoute = async (id: string) => {
    if (!confirm('¿Eliminar esta ruta?')) return;
    await fetch('/api/admin/routes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setActiveTab('sights'); setShowForm(false); setEditingSight(null); setEditingRoute(null); }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            activeTab === 'sights' ? 'bg-terracota-500 text-white' : 'bg-white text-tinta/60 border border-tinta/10 hover:border-terracota-300'
          )}
        >
          <MapPin size={16} />
          Sitios para visitar ({sights.length})
        </button>
        <button
          onClick={() => { setActiveTab('routes'); setShowForm(false); setEditingSight(null); setEditingRoute(null); }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
            activeTab === 'routes' ? 'bg-terracota-500 text-white' : 'bg-white text-tinta/60 border border-tinta/10 hover:border-terracota-300'
          )}
        >
          <Route size={16} />
          Rutas a pie ({routes.length})
        </button>
      </div>

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingSight(null);
            setEditingRoute(null);
            setLangTab('es');
          }}
          className="btn-primary gap-2"
        >
          <Plus size={16} />
          {activeTab === 'sights' ? 'Añadir sitio' : 'Añadir ruta'}
        </button>
      )}

      {/* Form */}
      {showForm && activeTab === 'sights' && (
        <SightForm
          sight={editingSight}
          onCancel={() => { setShowForm(false); setEditingSight(null); }}
          onSaved={loadData}
          langTab={langTab}
          setLangTab={setLangTab}
        />
      )}

      {showForm && activeTab === 'routes' && (
        <RouteForm
          route={editingRoute}
          onCancel={() => { setShowForm(false); setEditingRoute(null); }}
          onSaved={loadData}
          langTab={langTab}
          setLangTab={setLangTab}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-tinta/40">Cargando...</div>
      ) : activeTab === 'sights' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sights.map((sight) => (
            <div key={sight.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CATEGORIES.find(c => c.value === sight.category)?.icon || '📍'}</span>
                  <div>
                    <h3 className="font-semibold text-tinta text-sm">{sight.name}</h3>
                    <p className="text-xs text-tinta/50">{CATEGORIES.find(c => c.value === sight.category)?.label}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingSight(sight); setShowForm(true); setLangTab('es'); }}
                    className="p-1.5 rounded-lg hover:bg-crema text-tinta/40 hover:text-terracota-600"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteSight(sight.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-tinta/40 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {sight.image && (
                <img src={sight.image} alt={sight.name} className="w-full h-32 object-cover rounded-xl mb-3" />
              )}
              <div className="space-y-1 text-xs text-tinta/60">
                <p>📍 {sight.lat.toFixed(5)}, {sight.lng.toFixed(5)}</p>
                {sight.walk_minutes && <p>🚶 {sight.walk_minutes} min andando</p>}
                {sight.entrance && <p>🎫 {sight.entrance}</p>}
                {sight.url && <p>🔗 <a href={sight.url} target="_blank" className="text-terracota-500">Web</a></p>}
              </div>
              <p className="text-xs text-tinta/50 mt-2 line-clamp-2">{sight.description?.es || ''}</p>
            </div>
          ))}
          {sights.length === 0 && (
            <div className="col-span-full card p-8 text-center text-tinta/40">
              No hay sitios para visitar. Añade el primero.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {route.image && (
                    <img src={route.image} alt={route.title?.es} className="w-16 h-16 rounded-xl object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold text-tinta">{route.title?.es || route.route_id}</h3>
                    <div className="flex items-center gap-3 text-xs text-tinta/50 mt-1">
                      <span>{ROUTE_CATEGORIES.find(c => c.value === route.category)?.label}</span>
                      {route.duration && <span>⏱️ {route.duration}</span>}
                      {route.distance && <span>📏 {route.distance}</span>}
                      {route.difficulty && (
                        <span className={DIFFICULTIES.find(d => d.value === route.difficulty)?.color}>
                          {DIFFICULTIES.find(d => d.value === route.difficulty)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingRoute(route); setShowForm(true); setLangTab('es'); }}
                    className="p-1.5 rounded-lg hover:bg-crema text-tinta/40 hover:text-terracota-600"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteRoute(route.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-tinta/40 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-tinta/60 mb-3">{route.description?.es || ''}</p>
              <div className="flex items-center gap-2 text-xs text-tinta/40">
                <Navigation size={12} />
                <span>{route.stops?.length || 0} paradas</span>
              </div>
            </div>
          ))}
          {routes.length === 0 && (
            <div className="card p-8 text-center text-tinta/40">
              No hay rutas a pie. Añade la primera.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== SIGHT FORM ====================

function SightForm({
  sight,
  onCancel,
  onSaved,
  langTab,
  setLangTab,
}: {
  sight: Sight | null;
  onCancel: () => void;
  onSaved: () => void;
  langTab: string;
  setLangTab: (l: string) => void;
}) {
  const [form, setForm] = useState<Partial<Sight>>({
    name: sight?.name || '',
    category: sight?.category || 'monument',
    lat: sight?.lat || 0,
    lng: sight?.lng || 0,
    walk_minutes: sight?.walk_minutes || null,
    entrance: sight?.entrance || '',
    url: sight?.url || '',
    image: sight?.image || '',
    description: sight?.description || { es: '', en: '', fr: '', de: '', it: '', pt: '' },
  });
  const [saving, setSaving] = useState(false);

  const updateDesc = (lang: string, value: string) => {
    setForm(prev => ({
      ...prev,
      description: { ...(prev.description || {}), [lang]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...(sight?.id ? { id: sight.id } : {}),
      ...form,
    };

    const res = await fetch('/api/admin/sights', {
      method: sight ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSaved();
      onCancel();
    } else {
      alert('Error al guardar');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-tinta">{sight ? 'Editar sitio' : 'Nuevo sitio para visitar'}</h3>
        <button type="button" onClick={onCancel} className="p-1 rounded-lg hover:bg-crema"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Nombre</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="Catedral de Sevilla"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="input"
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Latitud</label>
          <input
            type="number"
            step="any"
            required
            value={form.lat || ''}
            onChange={e => setForm({ ...form, lat: parseFloat(e.target.value) })}
            className="input"
            placeholder="37.38564"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Longitud</label>
          <input
            type="number"
            step="any"
            required
            value={form.lng || ''}
            onChange={e => setForm({ ...form, lng: parseFloat(e.target.value) })}
            className="input"
            placeholder="-5.99295"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Min. andando</label>
          <input
            type="number"
            value={form.walk_minutes || ''}
            onChange={e => setForm({ ...form, walk_minutes: e.target.value ? parseInt(e.target.value) : null })}
            className="input"
            placeholder="15"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Entrada</label>
          <input
            type="text"
            value={form.entrance || ''}
            onChange={e => setForm({ ...form, entrance: e.target.value })}
            className="input"
            placeholder="12€ / Gratis lunes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">URL web</label>
          <input
            type="url"
            value={form.url || ''}
            onChange={e => setForm({ ...form, url: e.target.value })}
            className="input"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-tinta/70 mb-1">URL imagen</label>
        <input
          type="url"
          value={form.image || ''}
          onChange={e => setForm({ ...form, image: e.target.value })}
          className="input"
          placeholder="https://images.unsplash.com/..."
        />
        {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />}
      </div>

      {/* Multi-language description */}
      <div>
        <label className="block text-sm font-medium text-tinta/70 mb-2">Descripción</label>
        <div className="flex gap-1 mb-2">
          {LANGS.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => setLangTab(lang)}
              className={cn(
                'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                langTab === lang ? 'bg-terracota-500 text-white' : 'bg-crema text-tinta/50 hover:bg-terracota-100'
              )}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
        <textarea
          value={form.description?.[langTab] || ''}
          onChange={e => updateDesc(langTab, e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder={`Descripción en ${LANG_LABELS[langTab]}...`}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Guardando...' : sight ? '💾 Actualizar' : '➕ Crear sitio'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

// ==================== ROUTE FORM ====================

function RouteForm({
  route,
  onCancel,
  onSaved,
  langTab,
  setLangTab,
}: {
  route: TouristRoute | null;
  onCancel: () => void;
  onSaved: () => void;
  langTab: string;
  setLangTab: (l: string) => void;
}) {
  const [form, setForm] = useState<Partial<TouristRoute>>({
    route_id: route?.route_id || '',
    category: route?.category || 'classic',
    duration: route?.duration || '',
    distance: route?.distance || '',
    difficulty: route?.difficulty || 'easy',
    image: route?.image || '',
    title: route?.title || { es: '', en: '', fr: '', de: '', it: '', pt: '' },
    description: route?.description || { es: '', en: '', fr: '', de: '', it: '', pt: '' },
    stops: route?.stops || [],
  });
  const [saving, setSaving] = useState(false);

  const updateTitle = (lang: string, value: string) => {
    setForm(prev => ({ ...prev, title: { ...(prev.title || {}), [lang]: value } }));
  };
  const updateDesc = (lang: string, value: string) => {
    setForm(prev => ({ ...prev, description: { ...(prev.description || {}), [lang]: value } }));
  };

  const addStop = () => {
    setForm(prev => ({
      ...prev,
      stops: [...(prev.stops || []), { name: '', lat: 0, lng: 0, description: { es: '', en: '', fr: '', de: '', it: '', pt: '' } }],
    }));
  };

  const updateStop = (idx: number, field: string, value: any) => {
    setForm(prev => {
      const stops = [...(prev.stops || [])];
      if (field === 'description') {
        stops[idx] = { ...stops[idx], description: { ...(stops[idx].description || {}), [langTab]: value } };
      } else {
        stops[idx] = { ...stops[idx], [field]: value };
      }
      return { ...prev, stops };
    });
  };

  const removeStop = (idx: number) => {
    setForm(prev => ({ ...prev, stops: (prev.stops || []).filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...(route?.id ? { id: route.id } : {}),
      ...form,
    };

    const res = await fetch('/api/admin/routes', {
      method: route ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSaved();
      onCancel();
    } else {
      alert('Error al guardar');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-tinta">{route ? 'Editar ruta' : 'Nueva ruta a pie'}</h3>
        <button type="button" onClick={onCancel} className="p-1 rounded-lg hover:bg-crema"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">ID de ruta (slug)</label>
          <input
            type="text"
            required
            value={form.route_id}
            onChange={e => setForm({ ...form, route_id: e.target.value })}
            className="input"
            placeholder="ruta-casco-antiguo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="input"
          >
            {ROUTE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Duración</label>
          <input
            type="text"
            value={form.duration || ''}
            onChange={e => setForm({ ...form, duration: e.target.value })}
            className="input"
            placeholder="2-3h"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Distancia</label>
          <input
            type="text"
            value={form.distance || ''}
            onChange={e => setForm({ ...form, distance: e.target.value })}
            className="input"
            placeholder="3.5 km"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta/70 mb-1">Dificultad</label>
          <select
            value={form.difficulty}
            onChange={e => setForm({ ...form, difficulty: e.target.value })}
            className="input"
          >
            {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-tinta/70 mb-1">URL imagen</label>
        <input
          type="url"
          value={form.image || ''}
          onChange={e => setForm({ ...form, image: e.target.value })}
          className="input"
          placeholder="https://images.unsplash.com/..."
        />
        {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />}
      </div>

      {/* Multi-language title & description */}
      <div>
        <div className="flex gap-1 mb-2">
          {LANGS.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => setLangTab(lang)}
              className={cn(
                'px-2 py-1 rounded-lg text-xs font-medium transition-colors',
                langTab === lang ? 'bg-terracota-500 text-white' : 'bg-crema text-tinta/50 hover:bg-terracota-100'
              )}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-tinta/50 mb-1">Título ({LANG_LABELS[langTab]})</label>
            <input
              type="text"
              value={form.title?.[langTab] || ''}
              onChange={e => updateTitle(langTab, e.target.value)}
              className="input"
              placeholder={`Título en ${langTab}...`}
            />
          </div>
          <div>
            <label className="block text-xs text-tinta/50 mb-1">Descripción ({LANG_LABELS[langTab]})</label>
            <textarea
              value={form.description?.[langTab] || ''}
              onChange={e => updateDesc(langTab, e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder={`Descripción en ${langTab}...`}
            />
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-tinta/70">Paradas ({form.stops?.length || 0})</label>
          <button type="button" onClick={addStop} className="text-xs text-terracota-500 hover:text-terracota-600 flex items-center gap-1">
            <Plus size={12} /> Añadir parada
          </button>
        </div>
        <div className="space-y-3">
          {form.stops?.map((stop, idx) => (
            <div key={idx} className="bg-crema/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-tinta/50">Parada {idx + 1}</span>
                <button type="button" onClick={() => removeStop(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={stop.name}
                  onChange={e => updateStop(idx, 'name', e.target.value)}
                  className="input text-sm"
                  placeholder="Nombre"
                />
                <input
                  type="number"
                  step="any"
                  value={stop.lat || ''}
                  onChange={e => updateStop(idx, 'lat', parseFloat(e.target.value))}
                  className="input text-sm"
                  placeholder="Lat"
                />
                <input
                  type="number"
                  step="any"
                  value={stop.lng || ''}
                  onChange={e => updateStop(idx, 'lng', parseFloat(e.target.value))}
                  className="input text-sm"
                  placeholder="Lng"
                />
              </div>
              <textarea
                value={stop.description?.[langTab] || ''}
                onChange={e => updateStop(idx, 'description', e.target.value)}
                rows={1}
                className="input text-sm resize-none"
                placeholder={`Descripción parada (${langTab})...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Guardando...' : route ? '💾 Actualizar ruta' : '➕ Crear ruta'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}
