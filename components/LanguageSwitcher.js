// import { useRouter } from "next/router";

// const LanguageSwitcher = () => {
//   const router = useRouter();
//   const { locale, locales, pathname, query, asPath } = router;

//   const changeLanguage = (newLocale) => {
//     router.push({ pathname, query }, asPath, { locale: newLocale });
//     console.log(newLocale);
//    // i18n.changeLanguage(newLocale);
//   };

//   return (
//     <div>
//       {locales.map((loc) => (
//         <button
//           key={loc}
//           onClick={() => changeLanguage(loc)}
//           disabled={locale === loc}
//           className="btn-ghost btn-sm text-neutral-content border-2 border-neutral-content p-1 m-1 mx-3"
//         >
//           {loc}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default LanguageSwitcher;
