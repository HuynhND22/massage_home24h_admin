import { Box, Button, Group, Paper, Title } from '@mantine/core';
import { IBlogTranslation } from '../../../interfaces/blog-translation.interface';
import { BlogTranslationForm } from './BlogTranslationForm';
import { BlogTranslationsProps } from '../../../interfaces/blog-translation.interface';

export function BlogTranslations({ translations, onChange }: BlogTranslationsProps) {
  const handleAdd = () => {
    onChange([...translations, {}]);
  };

  const handleChange = (index: number, values: Partial<IBlogTranslation>) => {
    const newTranslations = [...translations];
    newTranslations[index] = values;
    onChange(newTranslations);
  };

  const handleRemove = (index: number) => {
    const newTranslations = translations.filter((_, i) => i !== index);
    onChange(newTranslations);
  };

  return (
    <Box>
      <Title order={2} mb="md">Translations</Title>
      {translations.map((translation, index) => (
        <Paper key={index} p="md" mb="md" withBorder>
          <Group justify="flex-end">
            <Button color="red" onClick={() => handleRemove(index)}>
              Remove Translation
            </Button>
          </Group>
          <BlogTranslationForm
            initialValues={translation}
            onChange={(values) => handleChange(index, values)}
          />
        </Paper>
      ))}
      <Button onClick={handleAdd}>Add Translation</Button>
    </Box>
  );
}
