const fs = require("fs");
const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function walk(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function move(fromRelative, toRelative) {
  const from = path.join(root, fromRelative);
  const to = path.join(root, toRelative);

  if (!exists(from) || exists(to)) {
    return;
  }

  ensureDir(path.dirname(to));
  fs.renameSync(from, to);
  console.log(`Moved ${fromRelative} -> ${toRelative}`);
}

function removeEmptyDirs(dir) {
  if (!exists(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}

function rewriteRelativeImportsToAlias() {
  for (const file of walk(src).filter((filePath) => /\.(ts|tsx)$/.test(filePath))) {
    const content = fs.readFileSync(file, "utf8");
    const replaceImport = (match, prefix, importPath, suffix) => {
      if (!importPath.startsWith(".")) return match;

      const resolved = path.resolve(path.dirname(file), importPath);
      if (!resolved.startsWith(src)) return match;

      const relative = path.relative(src, resolved).replace(/\\/g, "/");
      return `${prefix}@/${relative}${suffix}`;
    };

    const updated = content
      .replace(/(from\s+["'])(\.{1,2}\/[^"'\r\n]+)(["'])/g, replaceImport)
      .replace(/(import\s+["'])(\.{1,2}\/[^"'\r\n]+)(["'])/g, replaceImport);

    if (updated !== content) {
      fs.writeFileSync(file, updated, "utf8");
    }
  }

  console.log("Alias imports updated.");
}

function replaceInSource(replacements) {
  for (const file of walk(src).filter((filePath) => /\.(ts|tsx)$/.test(filePath))) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;

    for (const [fromText, toText] of replacements) {
      content = content.split(fromText).join(toText);
    }

    if (content !== original) {
      fs.writeFileSync(file, content, "utf8");
    }
  }

  console.log("Alias paths adjusted to new structure.");
}

rewriteRelativeImportsToAlias();

move("src/context", "src/app/providers");
move("src/hooks", "src/app/hooks");
move("src/routes", "src/app/routes");
move("src/components/AuthGuard.tsx", "src/app/guards/AuthGuard.tsx");

move("src/constants", "src/shared/constants");
move("src/services", "src/shared/services");
move("src/types", "src/shared/types");
move("src/utils", "src/shared/utils");
move("src/components/ui", "src/shared/components/ui");
move("src/components/BenefitCard.tsx", "src/shared/components/common/BenefitCard.tsx");
move("src/components/VideoPlayer.tsx", "src/shared/components/common/VideoPlayer.tsx");
move("src/assets", "src/shared/assets");
move("src/shared/assets/Logo.png", "src/shared/assets/branding/Logo.png");
move("src/shared/assets/Banner.png", "src/shared/assets/branding/Banner.png");
move("src/shared/assets/femaleAdmin.png", "src/shared/assets/avatars/femaleAdmin.png");
move("src/shared/assets/femaleStudant.png", "src/shared/assets/avatars/femaleStudant.png");
move("src/shared/assets/maleAdmin.png", "src/shared/assets/avatars/maleAdmin.png");
move("src/shared/assets/maleStudant.jpg", "src/shared/assets/avatars/maleStudant.jpg");
move("src/shared/assets/maleTeacher.jpg", "src/shared/assets/avatars/maleTeacher.jpg");

move("src/components/layout/public", "src/features/public/components");
move("src/pages/AboutPage.tsx", "src/features/public/pages/AboutPage.tsx");
move("src/pages/FeaturesPage.tsx", "src/features/public/pages/FeaturesPage.tsx");
move("src/pages/HomePage.tsx", "src/features/public/pages/HomePage.tsx");
move("src/pages/PricingPage.tsx", "src/features/public/pages/PricingPage.tsx");
move("src/pages/Unauthorized.tsx", "src/features/public/pages/Unauthorized.tsx");

move("src/pages/auth", "src/features/auth/pages");
move("src/api/auth.api.ts", "src/features/auth/api/auth.api.ts");

move("src/pages/admin", "src/features/admin/pages");

move("src/components/layout/student", "src/features/student/components");
move("src/pages/students", "src/features/student/pages");
move("src/api/courseStudent.api.ts", "src/features/student/api/courseStudent.api.ts");

move("src/components/layout/teacher", "src/features/teacher/components");
move("src/pages/teacher", "src/features/teacher/pages");
move("src/pages/videoplayer", "src/features/teacher/pages/video");
move("src/api/attachmentTeacher.api.ts", "src/features/teacher/api/attachmentTeacher.api.ts");
move("src/api/courseEnrollment.api.ts", "src/features/teacher/api/courseEnrollment.api.ts");
move("src/api/courseTeacher.api.ts", "src/features/teacher/api/courseTeacher.api.ts");
move("src/api/exerciseTeacher.api.ts", "src/features/teacher/api/exerciseTeacher.api.ts");
move("src/api/lessonTeacher.api.ts", "src/features/teacher/api/lessonTeacher.api.ts");
move("src/api/moduleTeacher.api.ts", "src/features/teacher/api/moduleTeacher.api.ts");
move("src/api/questionTeacher.api.ts", "src/features/teacher/api/questionTeacher.api.ts");
move("src/api/subject.api.ts", "src/features/teacher/api/subject.api.ts");
move("src/api/videoTeacher.api.ts", "src/features/teacher/api/videoTeacher.api.ts");

move("src/api/http.ts", "src/shared/api/http.ts");
move("src/pages/Settings.tsx", "src/features/settings/pages/Settings.tsx");
move("src/app/routes/studentRoutes.tsx", "src/app/routes/StudentRoutes.tsx");

replaceInSource([
  ["@/routes/", "@/app/routes/"],
  ["@/components/AuthGuard", "@/app/guards/AuthGuard"],
  ["@/context/", "@/app/providers/"],
  ["@/hooks/", "@/app/hooks/"],
  ["@/constants/", "@/shared/constants/"],
  ["@/services/", "@/shared/services/"],
  ["@/types/", "@/shared/types/"],
  ["@/utils/", "@/shared/utils/"],
  ["@/components/ui/", "@/shared/components/ui/"],
  ["@/components/BenefitCard", "@/shared/components/common/BenefitCard"],
  ["@/components/VideoPlayer", "@/shared/components/common/VideoPlayer"],
  ["@/components/layout/public/", "@/features/public/components/"],
  ["@/pages/AboutPage", "@/features/public/pages/AboutPage"],
  ["@/pages/FeaturesPage", "@/features/public/pages/FeaturesPage"],
  ["@/pages/HomePage", "@/features/public/pages/HomePage"],
  ["@/pages/PricingPage", "@/features/public/pages/PricingPage"],
  ["@/pages/Unauthorized", "@/features/public/pages/Unauthorized"],
  ["@/pages/auth/", "@/features/auth/pages/"],
  ["@/api/auth.api", "@/features/auth/api/auth.api"],
  ["@/pages/admin/", "@/features/admin/pages/"],
  ["@/components/layout/student/", "@/features/student/components/"],
  ["@/pages/students/", "@/features/student/pages/"],
  ["@/api/courseStudent.api", "@/features/student/api/courseStudent.api"],
  ["@/components/layout/teacher/", "@/features/teacher/components/"],
  ["@/pages/teacher/", "@/features/teacher/pages/"],
  ["@/pages/videoplayer/", "@/features/teacher/pages/video/"],
  ["@/pages/Settings", "@/features/settings/pages/Settings"],
  ["@/api/http", "@/shared/api/http"],
  ["@/api/attachmentTeacher.api", "@/features/teacher/api/attachmentTeacher.api"],
  ["@/api/courseEnrollment.api", "@/features/teacher/api/courseEnrollment.api"],
  ["@/api/courseTeacher.api", "@/features/teacher/api/courseTeacher.api"],
  ["@/api/exerciseTeacher.api", "@/features/teacher/api/exerciseTeacher.api"],
  ["@/api/lessonTeacher.api", "@/features/teacher/api/lessonTeacher.api"],
  ["@/api/moduleTeacher.api", "@/features/teacher/api/moduleTeacher.api"],
  ["@/api/questionTeacher.api", "@/features/teacher/api/questionTeacher.api"],
  ["@/api/subject.api", "@/features/teacher/api/subject.api"],
  ["@/api/videoTeacher.api", "@/features/teacher/api/videoTeacher.api"],
  ["@/assets/Logo.png", "@/shared/assets/branding/Logo.png"],
  ["@/assets/Banner.png", "@/shared/assets/branding/Banner.png"],
  ["@/assets/femaleAdmin.png", "@/shared/assets/avatars/femaleAdmin.png"],
  ["@/assets/femaleStudant.png", "@/shared/assets/avatars/femaleStudant.png"],
  ["@/assets/maleAdmin.png", "@/shared/assets/avatars/maleAdmin.png"],
  ["@/assets/maleStudant.jpg", "@/shared/assets/avatars/maleStudant.jpg"],
  ["@/assets/maleTeacher.jpg", "@/shared/assets/avatars/maleTeacher.jpg"],
  ["@/app/routes/studentRoutes", "@/app/routes/StudentRoutes"]
]);

removeEmptyDirs(path.join(root, "src", "components"));
removeEmptyDirs(path.join(root, "src", "pages"));
removeEmptyDirs(path.join(root, "src", "api"));

console.log("Source tree reorganized successfully.");