export interface ISlide {
  id?: string;
  title: string;
  description?: string;
  image: string;
  role: string;
  order?: number;
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