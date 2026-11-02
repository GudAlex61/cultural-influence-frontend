import type { FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

interface ArtworkCreationDateFilterProps {
  artworkCreationDate: string;
  onDateChange: (date: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ArtworkCreationDateFilter({ artworkCreationDate, onDateChange, onApply, onReset }: ArtworkCreationDateFilterProps) {
  function submitArtworkDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  return (
    <Form className="artwork-filter" onSubmit={submitArtworkDate}>
      <Form.Label htmlFor="artwork-creation-date">Дата создания произведения</Form.Label>
      <div className="artwork-filter-controls">
        <Form.Control id="artwork-creation-date" type="date" value={artworkCreationDate}
          onChange={(event) => onDateChange(event.target.value)} />
        <Button type="submit">Найти</Button>
        <Button type="button" variant="outline-secondary" onClick={onReset}>Сбросить</Button>
      </div>
    </Form>
  );
}
