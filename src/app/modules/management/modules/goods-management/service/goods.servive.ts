import { Injectable } from '@angular/core';
import { bufferTime, catchError, filter, from, mergeMap, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { ApiGatewayService } from 'src/app/api-gateway/api-gateaway.service';
import { Goods, Goods2Create, Goods2Update } from '../model/goods.model';
import { FilesService } from '../../files-center-management/service/files-center.servive';
import { ENV } from 'src/environments/environment.development';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  url = '/admin/goods';

  private socket: any;
  private goodsChangeSubjects = new Map<string, Subject<any>>();
  private socketHandlers = new Map<string, (goods: any) => void>();
  private registeredEvents = new Set<string>(); // Track registered events

  constructor(private apiGatewayService: ApiGatewayService, private filesService: FilesService) {
    this.socket = io(ENV.WEBSOCKET_URL);

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server, socket.id:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });
  }

  findAll() {
    const url = `${this.url}/find-all`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }

  findAllByRole(role: string) {
    const url = `${this.url}/find-all/${role}`;
    return this.apiGatewayService.get(url).pipe(tap((res: any) => {}));
  }
  findOne(_id: string, skipLoading?: boolean) {
    const url = `${this.url}/${_id}`;
    return this.apiGatewayService.get(url, skipLoading).pipe(tap((res: any) => {}));
  }

  searchGoods(
    searchParams = {
      pageIdx: 1,
      startDate: '' as Date | '',
      endDate: '' as Date | '',
      pageSize: 5,
      keyword: '',
      sortBy: {
        key: 'createdAt',
        value: 'descend',
      },
      filters: [] as any[],
    },
  ) {
    const url = `${this.url}/search`;
    const body = {
      pageIdx: searchParams.pageIdx,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      pageSize: searchParams.pageSize,
      keyword: searchParams.keyword,
      sortBy: searchParams.sortBy,
      filters: searchParams.filters,
    };

    return this.apiGatewayService.post(url, body, { skipLoading: true }).pipe(tap((res: any) => {}));
  }

  processCreateGoods(imageFile: FileList, goods2Create: Goods2Create) {
    const url = this.url;
    // Kiểm tra nếu có file trong FileList
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any[]) => {
          // Gắn các liên kết trả về từ uploadFiles
          goods2Create.imageIds = res.map((file) => file._id);
          return this.createGoods(goods2Create);
        }),
      );
    } else {
      // Nếu không có file, chỉ gọi post trực tiếp
      return this.createGoods(goods2Create);
    }
  }

  createGoods(goods2Create: Goods2Create) {
    const url = `${this.url}`;
    return this.apiGatewayService.post(url, goods2Create).pipe(tap((res: any) => {}));
  }

  processUpdateGoods(imageFile: FileList, goods2Update: Goods2Update) {
    const url = this.url;

    // Nếu có file mới, upload và thêm vào imageIds hiện tại
    if (imageFile.length > 0) {
      return this.filesService.uploadFiles(imageFile).pipe(
        switchMap((res: any[]) => {
          // Lấy imageIds từ files mới upload
          const newImageIds = res.map((file) => file._id);

          // Kết hợp imageIds hiện tại với imageIds mới
          goods2Update.imageIds = [...(goods2Update.imageIds || []), ...newImageIds];

          return this.updateGoods(goods2Update);
        }),
      );
    } else {
      // Không có file mới, chỉ update với imageIds hiện tại
      return this.updateGoods(goods2Update);
    }
  }

  updateGoods(goods2Update: Goods2Update) {
    const url = `${this.url}`;
    return this.apiGatewayService.put(url, goods2Update).pipe(tap((res: any) => {}));
  }

  deleteGoods(id: string) {
    const deleteOptionUrl = this.url + `/${id}`;
    return this.apiGatewayService.delete(deleteOptionUrl).pipe(tap((res: any) => {}));
  }

  listenGoodsChangeOfId(Id: string): Observable<any> {
    const eventName = `goodsChangeOfId/${Id}`;

    // Check if we already have a Subject for this busScheduleId
    if (!this.goodsChangeSubjects.has(Id)) {
      const subject = new Subject<any>();
      this.goodsChangeSubjects.set(Id, subject);
    }

    // CRITICAL: Only register socket listener if not already registered
    if (!this.registeredEvents.has(eventName)) {
      const subject = this.goodsChangeSubjects.get(Id)!;

      const handler = (goods: any) => {
        subject.next(goods);
      };

      this.socketHandlers.set(eventName, handler);
      this.socket.on(eventName, handler);
      this.registeredEvents.add(eventName);
    }

    // Buffer events in 50ms windows and deduplicate within each window
    return this.goodsChangeSubjects
      .get(Id)!
      .asObservable()
      .pipe(
        bufferTime(50),
        filter((goods) => goods.length > 0),
        mergeMap((goods) => {
          // Deduplicate goods by _id within the 50ms window
          const uniqueGoods = Array.from(new Map(goods.map((b) => [b._id, b])).values());
          return uniqueGoods;
        }),
      );
  }
}
