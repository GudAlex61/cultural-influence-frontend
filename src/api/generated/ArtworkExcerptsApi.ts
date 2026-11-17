/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ArtworkExcerptResponseDto {
  id: number;
  artworkTitle: string;
  shortDescription: string | null;
  imageUrl: string;
  videoUrl: string;
  /** @format date */
  artworkCreationDate: string | null;
  citationCount: number | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  formationDate: string | null;
  likeCount: number;
  isOwner: 0 | 1;
  isLiked: 0 | 1;
}

export interface PublishArtworkExcerptDto {
  /** @example "Краткое описание отрывка" */
  shortDescription: string;
  /**
   * @format date
   * @example "1866-01-01"
   */
  artworkCreationDate: string;
  /**
   * @min 0
   * @example 12
   */
  citationCount: number;
}

export interface SetArtworkExcerptLikeDto {
  /** @example 1 */
  liked: 0 | 1;
}

export interface RegisterUserDto {
  /** @example "art_reader" */
  username: string;
  /** @example "Читатель искусства" */
  displayName: string;
  /** @example "StrongPassword123!" */
  password: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  displayName: string;
}

export interface LoginDto {
  /** @example "art_reader" */
  username: string;
  /** @example "StrongPassword123!" */
  password: string;
}

export interface ArtworkExcerptsControllerGetPublishedParams {
  artworkCreationDate?: string;
}

export interface ArtworkExcerptsControllerGetFeedParams {
  next?: string;
  id: number;
}

export interface ArtworkExcerptsControllerPublishParams {
  id: number;
}

export interface ArtworkExcerptsControllerSetLikeParams {
  id: number;
}

export interface ArtworkExcerptsControllerDeleteParams {
  id: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Культурный след — API
 * @version 4.0
 * @contact
 *
 * ЛР-4: отрывки произведений искусства, пользователи и сессии
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  artworkExcerpts = {
    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerGetPublished
     * @summary Плитка опубликованных отрывков с фильтром по дате создания произведения
     * @request GET:/api/artwork_excerpts
     * @response `200` `(ArtworkExcerptResponseDto)[]`
     */
    artworkExcerptsControllerGetPublished: (
      query: ArtworkExcerptsControllerGetPublishedParams = {},
      params: RequestParams = {},
    ) =>
      this.request<ArtworkExcerptResponseDto[], any>({
        path: `/api/artwork_excerpts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerCreateDraft
     * @summary Создать черновик с фото и видео в MinIO
     * @request POST:/api/artwork_excerpts
     * @secure
     * @response `201` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerCreateDraft: (
      data: {
        /** @example "Цитата из романа" */
        artworkTitle: string;
        /** @format binary */
        image: File;
        /** @format binary */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerGetDraft
     * @summary Черновик вошедшего пользователя
     * @request GET:/api/artwork_excerpts/draft
     * @secure
     * @response `200` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerGetDraft: (params: RequestParams = {}) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerGetFirstFeed
     * @summary Первый опубликованный отрывок ленты
     * @request GET:/api/artwork_excerpts/feed
     * @response `200` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerGetFirstFeed: (params: RequestParams = {}) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts/feed`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerGetFeed
     * @summary Отрывок ленты по ID или следующий опубликованный
     * @request GET:/api/artwork_excerpts/feed/{id}
     * @response `200` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerGetFeed: (
      { id, ...query }: ArtworkExcerptsControllerGetFeedParams,
      params: RequestParams = {},
    ) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerPublish
     * @summary Опубликовать свой черновик
     * @request PUT:/api/artwork_excerpts/{id}/publication
     * @secure
     * @response `200` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerPublish: (
      { id }: ArtworkExcerptsControllerPublishParams,
      data: PublishArtworkExcerptDto,
      params: RequestParams = {},
    ) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts/${id}/publication`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerSetLike
     * @summary Поставить или отменить лайк
     * @request POST:/api/artwork_excerpts/{id}/likes
     * @secure
     * @response `200` `ArtworkExcerptResponseDto`
     */
    artworkExcerptsControllerSetLike: (
      { id }: ArtworkExcerptsControllerSetLikeParams,
      data: SetArtworkExcerptLikeDto,
      params: RequestParams = {},
    ) =>
      this.request<ArtworkExcerptResponseDto, any>({
        path: `/api/artwork_excerpts/${id}/likes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Отрывки произведений искусства
     * @name ArtworkExcerptsControllerDelete
     * @summary Логически удалить свой опубликованный отрывок
     * @request DELETE:/api/artwork_excerpts/{id}
     * @secure
     * @response `200` `void`
     */
    artworkExcerptsControllerDelete: (
      { id }: ArtworkExcerptsControllerDeleteParams,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/artwork_excerpts/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Пользователи
     * @name UsersControllerRegister
     * @summary Регистрация создателя отрывков
     * @request POST:/api/users
     * @response `201` `UserResponseDto`
     */
    usersControllerRegister: (
      data: RegisterUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, any>({
        path: `/api/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  sessions = {
    /**
     * No description
     *
     * @tags Сеансы пользователей
     * @name SessionsControllerAuthenticate
     * @summary Вход пользователя и создание Redis-сессии
     * @request POST:/api/sessions
     * @response `200` `UserResponseDto`
     */
    sessionsControllerAuthenticate: (
      data: LoginDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, any>({
        path: `/api/sessions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Сеансы пользователей
     * @name SessionsControllerLogout
     * @summary Удаление Redis-сессии и cookie
     * @request POST:/api/sessions/logout
     * @secure
     * @response `200` `void`
     */
    sessionsControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/sessions/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
