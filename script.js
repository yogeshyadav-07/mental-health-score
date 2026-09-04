const API_URL = "https://mental-health-score-njz4.onrender.com/predict";
const ARC_LENGTH = 251.2;

const ids = ['age','gender','country','academic_level','most_used_platform','purpose_of_use',
  'avg_daily_usage_hours','daily_unlocks','study_hours','physical_activity_hours',
  'sleep_hours_per_night','stress_level'];

const el = id => document.getElementById(id);
const form = el('predict-form');
const errorMsg = el('error-msg');
const placeholder = el('result-placeholder');
const resultBody = el('result-body');
const resultSub = el('result-sub');
const gaugeWrap = el('gauge-wrap');
const gaugeArc = el('gauge-arc');
const gaugeNum = el('gauge-num');
const gaugeBand = el('gauge-band');
const progressFill = el('progress-fill');
const progressCount = el('progress-count');

// live labels for sliders
['avg_daily_usage_hours','study_hours','physical_activity_hours','sleep_hours_per_night'].forEach(id=>{
  const input = el(id);
  const out = el(id+'-val');
  const sync = ()=> out.textContent = parseFloat(input.value).toFixed(1) + ' hrs';
  input.addEventListener('input', ()=>{ sync(); onAnyInput(); });
  sync();
});

function fieldsFilled(){
  return ids.filter(id=>{
    const v = el(id).value;
    return v !== '' && v !== null;
  }).length;
}

function updateProgress(){
  const filled = fieldsFilled();
  progressCount.textContent = `${filled}/${ids.length}`;
  progressFill.style.width = (filled/ids.length*100) + '%';

  el('dot-1').classList.toggle('done', ['age','gender','country','academic_level'].every(id=>el(id).value));
  el('dot-2').classList.toggle('done', ['most_used_platform','purpose_of_use','avg_daily_usage_hours','daily_unlocks'].every(id=>el(id).value));
  el('dot-3').classList.toggle('done', ['study_hours','physical_activity_hours','sleep_hours_per_night','stress_level'].every(id=>el(id).value));

  return filled;
}

// Lightweight heuristic just for the LIVE preview gauge (not the real model).
// Higher sleep / activity / study-balance and lower usage+stress push the preview up.
function heuristicPreview(){
  const usage = parseFloat(el('avg_daily_usage_hours').value);
  const sleep = parseFloat(el('sleep_hours_per_night').value);
  const activity = parseFloat(el('physical_activity_hours').value);
  const study = parseFloat(el('study_hours').value);
  const stressMap = {Low:9, Medium:6, High:3.5, '':6, 'Very High':1.5};
  const stress = stressMap[el('stress_level').value] ?? 6;

  let score = (sleep/8)*3.2 + (activity/2)*1.6 + Math.min(study/4,1)*1.3 + (stress/9)*3.0 - (usage/8)*1.4;
  return Math.max(0, Math.min(10, score));
}

function bandFor(score){
  if(score >= 7.5) return {label:'Thriving', color:'#2F6E52'};
  if(score >= 5.5) return {label:'Steady', color:'#B97A2E'};
  if(score >= 3.5) return {label:'Under strain', color:'#C1732F'};
  return {label:'Needs attention', color:'#B3505C'};
}

function paintGauge(score, {isFinal=false}={}){
  const clamped = Math.max(0, Math.min(10, score));
  const band = bandFor(clamped);
  placeholder.style.display = 'none';
  resultBody.style.display = 'block';
  gaugeWrap.classList.toggle('preview', !isFinal);
  gaugeNum.innerHTML = `${clamped.toFixed(isFinal?2:1)}<span>/10</span>`;
  gaugeArc.style.stroke = band.color;
  gaugeArc.style.strokeDashoffset = ARC_LENGTH * (1 - clamped/10);
  gaugeBand.textContent = isFinal ? band.label : band.label + ' (live preview)';
  gaugeBand.style.background = band.color + '26';
  gaugeBand.style.color = band.color;
}

function onAnyInput(){
  const filled = updateProgress();
  errorMsg.style.display = 'none';

  if(filled === 0){
    placeholder.style.display = 'block';
    resultBody.style.display = 'none';
    resultSub.textContent = 'Fill in every field to unlock the full prediction';
    return;
  }

  resultSub.textContent = filled === ids.length
    ? 'Ready — press "See my score" for the full prediction'
    : `${ids.length - filled} field${ids.length-filled===1?'':''} left for an accurate preview`;

  paintGauge(heuristicPreview(), {isFinal:false});
  el('f-sleep').textContent = el('sleep_hours_per_night').value ? el('sleep_hours_per_night').value + ' hrs/night' : '—';
  el('f-usage').textContent = el('avg_daily_usage_hours').value ? el('avg_daily_usage_hours').value + ' hrs/day' : '—';
  el('f-stress').textContent = el('stress_level').value || '—';
}

// wire up all inputs for live preview + progress
document.querySelectorAll('#predict-form input, #predict-form select').forEach(i=>{
  i.addEventListener('input', onAnyInput);
  i.addEventListener('change', onAnyInput);
});
updateProgress();

async function submitPrediction(e){
  e.preventDefault();
  errorMsg.style.display = 'none';

  const missing = ids.filter(id => !el(id).value);
  if(missing.length){
    errorMsg.textContent = 'Please fill in every field before submitting.';
    errorMsg.style.display = 'inline';
    el(missing[0]).focus();
    return;
  }

  [el('submit-btn'), el('submit-btn-mobile')].forEach(b=>{
    b.disabled = true;
    b.innerHTML = '<span class="spin"></span>Calculating…';
  });

  const payload = {
    age: parseInt(el('age').value, 10),
    gender: el('gender').value,
    country: el('country').value.trim() || 'Other',
    academic_level: el('academic_level').value,
    most_used_platform: el('most_used_platform').value,
    purpose_of_use: el('purpose_of_use').value,
    avg_daily_usage_hours: parseFloat(el('avg_daily_usage_hours').value),
    daily_unlocks: parseInt(el('daily_unlocks').value, 10),
    study_hours: parseFloat(el('study_hours').value),
    physical_activity_hours: parseFloat(el('physical_activity_hours').value),
    sleep_hours_per_night: parseFloat(el('sleep_hours_per_night').value),
    stress_level: el('stress_level').value
  };

  try{
    const res = await fetch(API_URL, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      const detail = await res.text();
      throw new Error(`Server responded ${res.status}: ${detail.slice(0,180)}`);
    }

    const data = await res.json();
    paintGauge(data.predicted_mental_health_score, {isFinal:true});
    resultSub.textContent = 'Model prediction';

  }catch(err){
    errorMsg.textContent = "Couldn't reach the model: " + err.message + " (the API may be waking up — try again in a moment).";
    errorMsg.style.display = 'inline';
  }finally{
    [el('submit-btn'), el('submit-btn-mobile')].forEach(b=>{
      b.disabled = false;
      b.textContent = 'See my score';
    });
  }
}

form.addEventListener('submit', submitPrediction);
[el('reset-btn'), el('reset-btn-mobile')].forEach(b=>b.addEventListener('click', ()=>{
  form.reset();
  onAnyInput();
}));
