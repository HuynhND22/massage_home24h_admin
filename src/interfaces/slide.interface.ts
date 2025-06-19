export interface SlideTranslation {
  id?: string;
  language: string;
  title: string;
  description?: string;
}

export interface ISlide {
  id?: string;
  image: string;
  role: string;
  order?: number;
  translations: SlideTranslation[];
}

export interface SlideTableProps {
  data: ISlide[];
  onEdit: (slide: ISlide) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface SlideListPageProps {
  data: ISlide[];
  onEdit: (slide: ISlide) => void;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export interface SlideActionsProps {
  slide: ISlide;
  onEdit: (slide: ISlide) => void;
  onRefresh: () => void;
}

export interface SlideFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  slide: ISlide | null;
} 