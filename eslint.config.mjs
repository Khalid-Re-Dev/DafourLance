import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'
export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'next-env.d.ts'] },
  { files: ['**/*.ts', '**/*.tsx'], languageOptions: { parser: tseslint.parser },
    plugins: { 'react-hooks': hooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } },
)
