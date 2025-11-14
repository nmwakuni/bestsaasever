"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Copy, Mail, Save } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface SignatureData {
  name: string;
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  template: "modern" | "classic" | "minimal" | "bold";
}

export default function CreateSignature() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const editId = searchParams?.get("edit");

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SignatureData>({
    name: "My Signature",
    fullName: "John Smith",
    jobTitle: "Product Manager",
    company: "Tech Innovations Inc.",
    email: "john@techinnovations.com",
    phone: "+1 (555) 123-4567",
    website: "www.techinnovations.com",
    linkedin: "linkedin.com/in/johnsmith",
    twitter: "@johnsmith",
    instagram: "@johnsmith",
    template: "modern",
  });

  // Load signature if editing
  useEffect(() => {
    if (editId && session) {
      fetch(`/api/signatures`)
        .then((res) => res.json())
        .then((data) => {
          const sig = data.signatures?.find((s: any) => s.id === parseInt(editId));
          if (sig) {
            setFormData({
              name: sig.name,
              fullName: sig.fullName,
              jobTitle: sig.jobTitle || "",
              company: sig.company || "",
              email: sig.email || "",
              phone: sig.phone || "",
              website: sig.website || "",
              linkedin: sig.linkedin || "",
              twitter: sig.twitter || "",
              instagram: sig.instagram || "",
              template: sig.template,
            });
          }
        });
    }
  }, [editId, session]);

  const handleChange = (field: keyof SignatureData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!session) {
      alert("Please sign in to save signatures");
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const url = editId ? `/api/signatures/${editId}` : "/api/signatures";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Signature saved successfully!");
        router.push("/dashboard");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save signature");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save signature");
    } finally {
      setSaving(false);
    }
  };

  const generateHTML = () => {
    const { fullName, jobTitle, company, email, phone, website, linkedin, twitter, instagram, template } = formData;

    if (template === "modern") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333;">
  <tr>
    <td style="padding: 0 20px 0 0; border-right: 3px solid #2563eb;">
      <div style="padding-right: 20px;">
        <div style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 4px;">${fullName}</div>
        <div style="font-size: 13px; color: #64748b; margin-bottom: 2px;">${jobTitle}</div>
        <div style="font-size: 13px; color: #64748b;">${company}</div>
      </div>
    </td>
    <td style="padding: 0 0 0 20px;">
      <div style="margin-bottom: 8px;">
        ${email ? `<div style="margin-bottom: 4px;">📧 <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>` : ''}
        ${phone ? `<div style="margin-bottom: 4px;">📱 ${phone}</div>` : ''}
        ${website ? `<div>🌐 <a href="https://${website}" style="color: #2563eb; text-decoration: none;">${website}</a></div>` : ''}
      </div>
      ${linkedin || twitter || instagram ? `<div style="margin-top: 8px;">
        ${linkedin ? `<a href="https://${linkedin}" style="color: #0077b5; text-decoration: none; margin-right: 8px;">LinkedIn</a>` : ''}
        ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: #1da1f2; text-decoration: none; margin-right: 8px;">Twitter</a>` : ''}
        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #e4405f; text-decoration: none;">Instagram</a>` : ''}
      </div>` : ''}
    </td>
  </tr>
</table>`;
    }

    if (template === "classic") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Georgia, serif; font-size: 14px; line-height: 1.6; color: #000;">
  <tr>
    <td>
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">${fullName}</div>
      <div style="font-style: italic; margin-bottom: 4px;">${jobTitle}</div>
      <div style="margin-bottom: 12px;">${company}</div>
      ${email ? `<div style="margin-bottom: 4px;">Email: <a href="mailto:${email}" style="color: #000; text-decoration: underline;">${email}</a></div>` : ''}
      ${phone ? `<div style="margin-bottom: 4px;">Phone: ${phone}</div>` : ''}
      ${website ? `<div style="margin-bottom: 4px;">Web: <a href="https://${website}" style="color: #000; text-decoration: underline;">${website}</a></div>` : ''}
      ${linkedin || twitter || instagram ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ccc;">
        ${linkedin ? `<a href="https://${linkedin}" style="color: #000; margin-right: 10px;">LinkedIn</a>` : ''}
        ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: #000; margin-right: 10px;">Twitter</a>` : ''}
        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #000;">Instagram</a>` : ''}
      </div>` : ''}
    </td>
  </tr>
</table>`;
    }

    if (template === "minimal") {
      return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.6; color: #333;">
  <div style="font-weight: 600; margin-bottom: 2px;">${fullName}</div>
  <div style="color: #666; margin-bottom: 8px;">${jobTitle} at ${company}</div>
  ${email ? `<div><a href="mailto:${email}" style="color: #333; text-decoration: none;">${email}</a></div>` : ''}
  ${phone ? `<div>${phone}</div>` : ''}
  ${linkedin || twitter || instagram ? `<div style="margin-top: 6px; font-size: 12px;">
    ${linkedin ? `<a href="https://${linkedin}" style="color: #666; margin-right: 8px;">in</a>` : ''}
    ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: #666; margin-right: 8px;">tw</a>` : ''}
    ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #666;">ig</a>` : ''}
  </div>` : ''}
</div>`;
    }

    if (template === "bold") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px;">
  <tr>
    <td>
      <div style="font-size: 20px; font-weight: bold; color: #fff; margin-bottom: 4px;">${fullName}</div>
      <div style="font-size: 14px; color: #f0f0f0; margin-bottom: 2px;">${jobTitle}</div>
      <div style="font-size: 14px; color: #f0f0f0; margin-bottom: 12px;">${company}</div>
      <div style="border-top: 2px solid rgba(255,255,255,0.3); padding-top: 12px; margin-top: 12px;">
        ${email ? `<div style="color: #fff; margin-bottom: 4px;">✉️ <a href="mailto:${email}" style="color: #fff; text-decoration: none;">${email}</a></div>` : ''}
        ${phone ? `<div style="color: #fff; margin-bottom: 4px;">📞 ${phone}</div>` : ''}
        ${website ? `<div style="color: #fff;">🌐 <a href="https://${website}" style="color: #fff; text-decoration: none;">${website}</a></div>` : ''}
      </div>
      ${linkedin || twitter || instagram ? `<div style="margin-top: 12px;">
        ${linkedin ? `<a href="https://${linkedin}" style="color: #fff; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; text-decoration: none; margin-right: 6px; font-size: 12px;">LinkedIn</a>` : ''}
        ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" style="color: #fff; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; text-decoration: none; margin-right: 6px; font-size: 12px;">Twitter</a>` : ''}
        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color: #fff; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 12px;">Instagram</a>` : ''}
      </div>` : ''}
    </td>
  </tr>
</table>`;
    }

    return "";
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              <span className="font-bold text-xl">SignaturePro</span>
            </div>
          </Link>
          {!session && (
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {editId ? "Edit Signature" : "Create Your Signature"}
            </h1>
            <p className="text-muted-foreground">
              Fill in your details and watch the preview update in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Signature Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g., Work Signature, Personal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                      placeholder="Product Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Tech Innovations Inc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="www.yourcompany.com"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Social Media (Optional)</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) => handleChange("linkedin", e.target.value)}
                          placeholder="linkedin.com/in/yourname"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter/X</Label>
                        <Input
                          id="twitter"
                          value={formData.twitter}
                          onChange={(e) => handleChange("twitter", e.target.value)}
                          placeholder="@yourhandle"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={formData.instagram}
                          onChange={(e) => handleChange("instagram", e.target.value)}
                          placeholder="@yourhandle"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="mb-3 block">Choose Template</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "modern", name: "Modern", desc: "Clean & professional" },
                        { id: "classic", name: "Classic", desc: "Traditional serif" },
                        { id: "minimal", name: "Minimal", desc: "Simple & elegant" },
                        { id: "bold", name: "Bold", desc: "Eye-catching gradient" },
                      ].map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleChange("template", template.id as SignatureData["template"])}
                          className={`p-3 border-2 rounded-lg text-left transition-all ${
                            formData.template === template.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-semibold text-sm">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 mb-4 min-h-[200px]">
                    <div dangerouslySetInnerHTML={{ __html: generateHTML() }} />
                  </div>

                  <div className="space-y-2">
                    <Button onClick={copyToClipboard} className="w-full" variant="outline">
                      {copied ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-5 w-5" />
                          Copy HTML
                        </>
                      )}
                    </Button>

                    {session && (
                      <Button onClick={handleSave} className="w-full" disabled={saving}>
                        {saving ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                            {editId ? "Update Signature" : "Save Signature"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">How to add to your email:</h4>
                    <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                      <li>Click "Copy HTML" above</li>
                      <li>Open your email settings</li>
                      <li>Find the signature section</li>
                      <li>Paste the HTML code</li>
                      <li>Save and you're done!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
