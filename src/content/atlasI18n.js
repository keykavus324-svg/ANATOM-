// Localised text for the 3D atlas shell and its scenes.
//
// Scenes keep their ids, groups, sources and lesson links from src/atlas.js; this
// module only replaces the readable text so saved scene ids and deep links work in
// every language.
import { atlasScenes, atlasGroups, ATLAS_SOURCE } from '../atlas.js';
import en from './atlas/i18n/en.js';
import ar from './atlas/i18n/ar.js';

const registry = { en, ar };

function sameLength(base, patch, where) {
  if (!Array.isArray(patch) || patch.length !== base.length) {
    throw new Error(`atlas translation drift at ${where}: expected ${base.length}, got ${patch?.length}`);
  }
}

export function atlasSceneIn(lang, scene) {
  const patch = registry[lang]?.scenes?.[scene.id];
  if (!patch) return scene;
  sameLength(scene.steps, patch.steps, `${scene.id}.steps`);
  return {
    ...scene,
    title: patch.title || scene.title,
    summary: patch.summary || scene.summary,
    observe: patch.observe || scene.observe,
    steps: patch.steps,
  };
}

export function atlasScenesIn(lang) {
  return atlasScenes.map(scene => atlasSceneIn(lang, scene));
}

export function findAtlasSceneIn(lang, id) {
  const scene = atlasScenes.find(item => item.id === id);
  return scene ? atlasSceneIn(lang, scene) : scene;
}

export function atlasGroupsIn(lang) {
  const patch = registry[lang]?.groups;
  if (!patch) return atlasGroups;
  return atlasGroups.map(group => ({
    ...group,
    label: patch[group.id]?.label || group.label,
    hint: patch[group.id]?.hint || group.hint,
  }));
}

export function atlasSourceIn(lang) {
  const patch = registry[lang]?.source;
  return patch ? { ...ATLAS_SOURCE, ...patch } : ATLAS_SOURCE;
}

export const TRANSLATED_ATLAS = {
  en: Object.keys(en.scenes),
  ar: Object.keys(ar.scenes),
};
