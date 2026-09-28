# NOIR 07

تجربة عطرية سينمائية ثلاثية الأبعاد مبنية بـ React وTypeScript وReact Three Fiber.

## التشغيل

```bash
npm install
npm run dev
```

لإنشاء نسخة الإنتاج:

```bash
npm run build
npm run preview
```

إعدادات وخطوات النشر الكاملة موجودة في [DEPLOYMENT.md](./DEPLOYMENT.md).

## البنية

- `src/components/StoryPanels.tsx`: الفصول والنصوص العربية.
- `src/three/PerfumeExperience.tsx`: الكاميرا، المشهد، الأداء، والمؤثرات.
- `src/three/PerfumeModel.tsx`: نموذج الزجاجة الإجرائي وأجزاء التفكيك.
- `src/three/Lighting.tsx`: الإضاءة المتغيرة حسب الفصل.
- `src/three/ScentParticles.tsx`: جزيئات مكونات العطر.
- `src/styles.css`: الهوية البصرية والاستجابة للجوال وتقليل الحركة.

## استبدال النموذج المؤقت

واجهة `PerfumeModel` معزولة عمدًا. عند توفر نموذج نهائي، ضعه مثلًا في
`public/models/noir-07.glb` واستبدل الهندسة الإجرائية داخل المكوّن بتحميل `useGLTF`، مع
الحفاظ على مجموعات الأجزاء `body` و`collar` و`pump` و`cap` حتى تستمر حركة التفكيك.
