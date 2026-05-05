'use client';

import { useState } from 'react';

export function LeadForm() {
  const [form, setForm] = useState({
    name: '',
    wechat: '',
    email: '',
    industry: '',
    problem: '',
    currentProcess: '',
    inputType: '',
    expectedOutput: '',
    volume: '',
    deliveryType: 'Web 工具',
    privateDeployment: false,
    budget: '',
    remark: '',
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const response = await fetch('/api/custom/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    setSubmitting(false);
    setMessage(data.message || (data.success ? '需求已提交' : '提交失败'));
    if (data.success) {
      setForm({
        name: '',
        wechat: '',
        email: '',
        industry: '',
        problem: '',
        currentProcess: '',
        inputType: '',
        expectedOutput: '',
        volume: '',
        deliveryType: 'Web 工具',
        privateDeployment: false,
        budget: '',
        remark: '',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6 sm:p-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">提交你的需求</h2>
        <p className="mt-3 body-muted">字段尽量填完整，方便我们判断输入格式、输出格式和交付方式。</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="姓名 / 称呼" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
        <Input label="微信号" value={form.wechat} onChange={(value) => setForm({ ...form, wechat: value })} required />
        <Input label="联系邮箱" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <Input label="所属行业" value={form.industry} onChange={(value) => setForm({ ...form, industry: value })} required />
      </div>
      <TextArea label="想解决的问题" value={form.problem} onChange={(value) => setForm({ ...form, problem: value })} required />
      <TextArea label="当前处理流程" value={form.currentProcess} onChange={(value) => setForm({ ...form, currentProcess: value })} required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="输入数据类型" value={form.inputType} onChange={(value) => setForm({ ...form, inputType: value })} required />
        <Input label="希望输出结果" value={form.expectedOutput} onChange={(value) => setForm({ ...form, expectedOutput: value })} required />
        <Input label="每天 / 每周处理量" value={form.volume} onChange={(value) => setForm({ ...form, volume: value })} required />
        <Input label="期望交付形式" value={form.deliveryType} onChange={(value) => setForm({ ...form, deliveryType: value })} required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="预算范围" value={form.budget} onChange={(value) => setForm({ ...form, budget: value })} />
        <label className="space-y-2 text-sm font-medium text-slate-700">
          私有化部署需求
          <select
            className="input-base"
            value={form.privateDeployment ? 'yes' : 'no'}
            onChange={(e) => setForm({ ...form, privateDeployment: e.target.value === 'yes' })}
          >
            <option value="no">否</option>
            <option value="yes">是</option>
          </select>
        </label>
      </div>
      <TextArea label="备注" value={form.remark} onChange={(value) => setForm({ ...form, remark: value })} />
      {message ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
      <button type="submit" disabled={submitting} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
        {submitting ? '提交中...' : '提交我的需求'}
      </button>
    </form>
  );
}

function Input({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <input className="input-base" value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <textarea className="textarea-base" value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
